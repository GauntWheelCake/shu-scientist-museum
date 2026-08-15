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
        expect.objectContaining({ code: 'NEGATIVE_PARTICIPANT_COUNT' }),
        expect.objectContaining({ code: 'MISSING_ALT_TEXT' }),
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
});
