import { activities } from './activities';
import { archives } from './archives';
import { events } from './events';
import { media } from './media';
import { scientists, stories } from './scientists';
import { spiritThemes } from './spirit-themes';
import type { ContentDataset, Scientist } from './types';
import { validateContent } from './validate';

const scientist = (overrides: Partial<Scientist> = {}): Scientist => ({
  id: 'scientist-qian-weichang',
  slug: 'qian-weichang',
  name: '钱伟长',
  years: '1912—2010',
  identity: '科学家、教育家',
  summary: '测试人物',
  fields: ['力学'],
  spiritIds: ['spirit-patriotism'],
  portrait: '/images/scientists/qian-weichang.webp',
  featured: true,
  chapters: [],
  ...overrides,
});

describe('validateContent', () => {
  it('reports every required content-integrity failure', () => {
    const invalidDataset: ContentDataset = {
      scientists: [
        scientist(),
        scientist({ name: '重复人物' }),
        scientist({ id: 'scientist-another', name: '重复别名人物' }),
      ],
      stories: [
        {
          id: 'story-broken-reference',
          slug: 'broken-reference',
          title: '无效关联',
          summary: '用于验证关联人物必须存在。',
          scientistIds: ['scientist-not-found'],
          spiritIds: ['spirit-patriotism'],
        },
      ],
      events: [],
      archives: [
        {
          id: 'archive-no-alt',
          title: '缺少替代文本的图片',
          kind: 'photo',
          year: '2026',
          sourceId: '',
          description: '用于验证图片替代文本。',
          image: '/images/archive/no-alt.webp',
          alt: '',
          scientistIds: ['scientist-qian-weichang'],
          spiritIds: ['spirit-patriotism'],
        },
      ],
      activities: [
        {
          id: 'activity-negative-count',
          title: '人数错误的活动',
          dateLabel: '待定',
          location: '待定',
          description: '用于验证活动人数。',
          participantCount: -1,
          status: 'planned',
          type: 'invalid' as never,
          image: {
            src: '',
            alt: '',
            sourceId: '',
          },
          scientistIds: [],
          spiritIds: [],
        },
      ],
      media: [
        {
          id: 'media-no-url',
          title: '没有地址的已发布影音',
          kind: 'video',
          status: 'published',
          description: '用于验证已发布影音元数据。',
          image: '/images/media/no-url.webp',
          alt: '影音封面',
          scientistIds: ['scientist-qian-weichang'],
          spiritIds: ['spirit-patriotism'],
        },
      ],
      spiritThemes: [
        {
          id: 'spirit-patriotism',
          title: '爱国',
          summary: '测试主题',
          keywords: ['爱国'],
        },
      ],
    };

    expect(validateContent(invalidDataset)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'DUPLICATE_ID' }),
        expect.objectContaining({ code: 'DUPLICATE_SLUG' }),
        expect.objectContaining({ code: 'MISSING_FEATURED_SCIENTIST' }),
        expect.objectContaining({ code: 'BROKEN_REFERENCE' }),
        expect.objectContaining({ code: 'PUBLISHED_MEDIA_WITHOUT_URL' }),
        expect.objectContaining({ code: 'PUBLISHED_MEDIA_WITHOUT_PLATFORM' }),
        expect.objectContaining({ code: 'NEGATIVE_PARTICIPANT_COUNT' }),
        expect.objectContaining({ code: 'MISSING_ALT_TEXT' }),
        expect.objectContaining({ code: 'MISSING_IMAGE_SRC' }),
        expect.objectContaining({ code: 'INVALID_SOURCE_ID' }),
        expect.objectContaining({ code: 'INVALID_ACTIVITY_TYPE' }),
      ]),
    );
  });
});

describe('museum content', () => {
  it('ships the eight sourced profiles and complete core-scientist chapters', () => {
    const issues = validateContent({
      scientists,
      stories,
      events,
      archives,
      activities,
      media,
      spiritThemes,
    });

    expect(issues).toEqual([]);
    expect(scientists.map(({ name }) => name)).toEqual([
      '钱伟长',
      '李三立',
      '黄宏嘉',
      '孙晋良',
      '周邦新',
      '杨雄里',
      '谢少荣',
      '岳晓冬',
    ]);
    expect(scientists.filter(({ featured }) => featured)).toHaveLength(3);
    expect(
      scientists
        .filter(({ featured }) => featured)
        .every(({ chapters }) => chapters.length >= 3),
    ).toBe(true);
  });

  it('keeps disputed supercomputer figures out of unconditional copy', () => {
    expect(JSON.stringify(scientists)).not.toMatch(/2\.(?:15|35)万亿次/);
  });

  it('uses research work rather than study or administration for Qian Weichang chapters', () => {
    const qianWeichang = scientists.find(
      ({ id }) => id === 'scientist-qian-weichang',
    );
    const chapterText = qianWeichang?.chapters
      .map(({ title, problem, action, significance }) =>
        [title, problem, action, significance].join(''),
      )
      .join('');

    expect(qianWeichang?.chapters.map(({ title }) => title)).toEqual([
      '航空太空领域研究',
      '板壳内禀统一理论',
      '从固体到流体的应用力学探索',
    ]);
    expect(chapterText).toMatch(/航空太空/);
    expect(chapterText).toMatch(/板壳/);
    expect(chapterText).toMatch(/固体/);
    expect(chapterText).toMatch(/流体/);
    expect(chapterText).not.toMatch(/转向物理|教育改革|校长任职/);
  });

  it('provides display and source metadata for archives and four activity filters', () => {
    expect(
      archives.every(({ image, sourceId, year }) =>
        image.endsWith(`/${sourceId}-${year}.webp`),
      ),
    ).toBe(true);
    expect(activities.map(({ type }) => type)).toEqual([
      'branch',
      'school',
      'community',
      'military',
    ]);
    expect(
      activities.every(
        ({ image }) =>
          image.src.length > 0 &&
          image.alt.length > 0 &&
          image.sourceId.length > 0,
      ),
    ).toBe(true);
    expect(media.every(({ description }) => description.length > 0)).toBe(
      true,
    );
  });
});
