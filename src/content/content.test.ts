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

  it('returns issues instead of throwing when required public metadata is absent', () => {
    const invalidDataset: ContentDataset = {
      scientists,
      stories,
      events,
      archives: [{ ...archives[0], year: '' }],
      activities: [
        {
          ...activities[0],
          status: 'completed',
          image: undefined,
        },
      ],
      media: [{ ...media[0], description: '' }],
      spiritThemes,
    };

    expect(() => validateContent(invalidDataset)).not.toThrow();
    expect(validateContent(invalidDataset)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'MISSING_ARCHIVE_YEAR' }),
        expect.objectContaining({ code: 'MISSING_MEDIA_DESCRIPTION' }),
        expect.objectContaining({ code: 'MISSING_ACTIVITY_IMAGE' }),
      ]),
    );
  });

  it.each([
    'javascript:alert(1)',
    'data:text/plain,unsafe',
    'http://example.com/video',
    'not a url',
  ])('rejects a published media URL that is not valid https: %s', (url) => {
    const invalidDataset: ContentDataset = {
      scientists,
      stories,
      events,
      archives,
      activities,
      media: [
        {
          ...media[0],
          status: 'published',
          platform: '示例平台',
          url,
        },
      ],
      spiritThemes,
    };

    expect(validateContent(invalidDataset)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'PUBLISHED_MEDIA_INVALID_URL',
          path: 'media[0].url',
        }),
      ]),
    );
  });
});

describe('museum content', () => {
  it('uses the six official science-spirit titles without changing stable IDs', () => {
    expect(spiritThemes.map(({ id, title }) => [id, title])).toEqual([
      ['spirit-patriotism', '胸怀祖国、服务人民'],
      ['spirit-innovation', '勇攀高峰、敢为人先'],
      ['spirit-truth-seeking', '追求真理、严谨治学'],
      ['spirit-dedication', '淡泊名利、潜心研究'],
      ['spirit-collaboration', '集智攻关、团结协作'],
      ['spirit-education', '甘为人梯、奖掖后学'],
    ]);
  });

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
        .every(({ chapters }) => chapters.length >= 2),
    ).toBe(true);
  });

  it('keeps extended scientist profiles within their sourced claims', () => {
    expect(
      Object.fromEntries(scientists.map((item) => [item.id, item])),
    ).toMatchObject({
      'scientist-sun-jinliang': {
        years: '1946年生',
        summary:
          '长期从事碳/碳复合材料、特种纤维及特种纺织材料研究，相关成果应用于劳动防护、航空、航天等领域。',
        spiritIds: ['spirit-innovation'],
      },
      'scientist-yang-xiongli': {
        years: '1941年生',
        spiritIds: ['spirit-innovation', 'spirit-truth-seeking'],
      },
      'scientist-xie-shaorong': {
        summary:
          '带领团队深耕海洋智能无人艇，研制“精海”系列无人艇并开展无人艇集群研究。',
      },
      'scientist-yue-xiaodong': {
        summary:
          '从事人工智能理论与应用研究，研究方向为机器学习、软计算与决策支持系统。',
        fields: ['机器学习', '软计算', '决策支持系统'],
        spiritIds: ['spirit-innovation', 'spirit-truth-seeking'],
      },
    });
  });

  it('keeps only sourced Li Sanli research claims', () => {
    const li = scientists.find(({ id }) => id === 'scientist-li-sanli')!;
    const chapter724 = li.chapters.find(
      ({ id }) => id === 'chapter-li-develop-724',
    )!;
    const liStory = stories.find(
      ({ id }) => id === 'story-li-building-chinese-computers',
    )!;

    expect(li.years).toBe('1935—2022');
    expect(li.chapters.map(({ id }) => id)).toEqual([
      'chapter-li-develop-724',
      'chapter-li-ziqiang-supercomputers',
    ]);
    expect(chapter724.problem).toBe(
      '20世纪70年代，我国高校大型计算机研制持续推进。',
    );
    expect(chapter724.action).toBe('李三立曾负责研制724机。');
    expect(chapter724.significance).toBe(
      '中国工程院记载，724机是20世纪70年代我国各大学中用于国家尖端科技规模最大的计算机。',
    );
    expect(liStory.summary).toBe(
      '从研制724机到建设“自强”高性能计算平台，持续推动我国计算机事业发展。',
    );
    expect(events.some(({ id }) => id === 'event-li-911-1964')).toBe(false);
    expect(JSON.stringify([li, liStory, events])).not.toMatch(
      /虚焊|插件没有测试档案|1964年3月/,
    );
  });

  it('keeps disputed supercomputer figures out of unconditional copy', () => {
    expect(JSON.stringify(scientists)).not.toMatch(/2\.(?:15|35)万亿次/);
  });

  it('uses conflict-safe award and return copy for Qian Weichang', () => {
    const qian = scientists.find(({ id }) => id === 'scientist-qian-weichang')!;
    const awardChapter = qian.chapters.find(
      ({ id }) => id === 'chapter-qian-circular-plate-perturbation',
    )!;
    const returnEvent = events.find(
      ({ id }) => id === 'event-qian-return-1946',
    )!;

    expect(awardChapter.significance).toBe(
      '相关工作获中国科学院国家科学奖二等奖。',
    );
    expect(returnEvent.description).toBe(
      '1946年5月，钱伟长回国，随后任清华大学教授。',
    );
    expect(JSON.stringify([awardChapter, returnEvent])).not.toMatch(
      /1955年|洛杉矶|乘船/,
    );
  });

  it('uses evidence-backed, conflict-safe research copy for Huang Hongjia', () => {
    const huang = scientists.find(
      ({ id }) => id === 'scientist-huang-hongjia',
    )!;
    const microwave = huang.chapters.find(
      ({ id }) => id === 'chapter-huang-microwave-principles',
    )!;
    const fiber = huang.chapters.find(
      ({ id }) => id === 'chapter-huang-single-mode-fiber',
    )!;
    const microwaveEvent = events.find(
      ({ id }) => id === 'event-huang-microwave-1964',
    )!;

    expect(huang.years).toBe('1924—2021');
    expect(microwave.action).toBe(
      '20世纪60年代，他把多年学习、实验和思考整理成约百万字的《微波原理》，由科学出版社出版。',
    );
    expect(microwave.significance).toBe(
      '该书成为国内该领域第一本专著，被国际学界称为一本“为中国人争气的书”。',
    );
    expect(fiber.action).toBe(
      '1979年，他在上海科学技术大学创建波科学研究实验室；此后带领团队并与上海石英厂等单位合作开展单模光纤研究，研制出我国第一根单模光纤。',
    );
    expect(
      huang.chapters.some(({ id }) => id === 'chapter-huang-wave-plate'),
    ).toBe(false);
    expect(microwaveEvent.dateLabel).toBe('20世纪60年代');
    expect(JSON.stringify([huang, microwaveEvent])).not.toMatch(
      /煤气灶|黄氏波片|1964年出版/,
    );
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
      '板壳非线性内禀统一理论',
      '圆薄板大挠度摄动解',
      '航空航天与奇异摄动研究',
    ]);
    expect(chapterText).toMatch(/钱伟长方程/);
    expect(chapterText).toMatch(/中心挠度/);
    expect(chapterText).toMatch(/钱伟长方法/);
    expect(chapterText).toMatch(/火箭/);
    expect(chapterText).toMatch(/导弹/);
    expect(chapterText).toMatch(/奇异摄动理论/);
    expect(chapterText).not.toMatch(/转向物理|教育改革|校长任职/);
  });

  it('provides display metadata for archives and keeps planned activities honest', () => {
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
      activities.map(
        ({
          id,
          dateLabel,
          location,
          description,
          status,
          participantCount,
          image,
        }) => ({
          id,
          dateLabel,
          location,
          description,
          status,
          participantCount,
          image,
        }),
      ),
    ).toEqual([
      {
        id: 'activity-branch-outreach-2026',
        dateLabel: '时间待重新确认（原计划2026年7月）',
        location: '计划地点：上海大学宝山校区',
        description:
          '原计划将科学家事迹整理为微党课、微团课，在党团支部开展宣讲；具体场次人数尚待核验。',
        status: 'planned',
        participantCount: 0,
        image: undefined,
      },
      {
        id: 'activity-school-outreach-2026',
        dateLabel: '时间待重新确认（原计划2026年7月）',
        location: '计划地点：上海大学附属小学等学校',
        description:
          '原计划面向九年义务教育阶段学校开展科学家精神宣讲；具体场次人数尚待核验。',
        status: 'planned',
        participantCount: 0,
        image: undefined,
      },
      {
        id: 'activity-community-outreach-2026',
        dateLabel: '时间待重新确认（原计划2026年7月）',
        location: '计划地点：宝山区友谊路街道、普陀区真如街道',
        description:
          '原计划在爱心暑托班、助老服务课等场合开展宣讲；具体场次人数尚待核验。',
        status: 'planned',
        participantCount: 0,
        image: undefined,
      },
      {
        id: 'activity-military-outreach-2026',
        dateLabel: '时间待重新确认（原计划2026年7月）',
        location: '计划地点：南京路上好八连事迹纪念馆等',
        description: '原计划面向部队开展科学家精神宣讲；具体场次人数尚待核验。',
        status: 'planned',
        participantCount: 0,
        image: undefined,
      },
    ]);
    expect(
      validateContent({
        scientists,
        stories,
        events,
        archives,
        activities,
        media,
        spiritThemes,
      }),
    ).toEqual([]);
    expect(media.every(({ description }) => description.length > 0)).toBe(true);
  });
});
