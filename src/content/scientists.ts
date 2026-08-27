import type { Scientist, Story } from './types';

export const scientists: Scientist[] = [
  {
    id: 'scientist-qian-weichang',
    slug: 'qian-weichang',
    name: '钱伟长',
    years: '1912—2010',
    identity: '科学家、教育家，上海大学首任校长',
    summary:
      '从文史特长生转向物理，以应用数学与力学研究回应国家需要，并长期推动教育改革。',
    fields: ['应用数学', '力学', '教育'],
    spiritIds: [
      'spirit-patriotism',
      'spirit-truth-seeking',
      'spirit-education',
    ],
    portrait: '/images/scientists/qian-weichang.webp',
    featured: true,
    chapters: [
      {
        id: 'chapter-qian-shell-intrinsic-theory',
        title: '板壳非线性内禀统一理论',
        problem:
          '板壳大挠度的非线性问题需要更统一的内禀理论描述。',
        action:
          '1941年，他与导师用50天完成《弹性板壳的内禀理论》，其中的非线性微分方程组后来被称为“钱伟长方程”。',
        significance:
          '这项工作成为板壳非线性内禀统一理论的代表性成果。',
      },
      {
        id: 'chapter-qian-circular-plate-perturbation',
        title: '圆薄板大挠度摄动解',
        problem:
          '受均匀压力的固定薄圆板存在大挠度求解难题。',
        action:
          '1947年，他以中心挠度为摄动参数导出摄动解，形成国际上所称的“钱伟长方法”。',
        significance: '相关工作获中国科学院国家科学奖二等奖。',
      },
      {
        id: 'chapter-qian-aerospace-singular-perturbation',
        title: '航空航天与奇异摄动研究',
        problem:
          '航空航天和火箭、导弹实验中的复杂力学问题需要新的分析方法。',
        action:
          '1942年底起，他在美国加州理工学院喷射推进研究所参与火箭和导弹实验，并发表了世界上第一篇奇异摄动理论论文。',
        significance:
          '这段研究把力学方法用于航空航天工程，并推动了奇异摄动理论研究。',
      },
    ],
  },
  {
    id: 'scientist-li-sanli',
    slug: 'li-sanli',
    name: '李三立',
    years: '1935—2022',
    identity: '中国工程院院士，高性能计算领域先驱',
    summary:
      '从电子管计算机到集群式高性能计算机，他持续参与并推动中国计算机事业的发展。',
    fields: ['计算机体系结构', '高性能计算', '网格技术'],
    spiritIds: [
      'spirit-patriotism',
      'spirit-truth-seeking',
      'spirit-collaboration',
      'spirit-education',
    ],
    portrait: '/images/scientists/li-sanli.webp',
    featured: true,
    chapters: [
      {
        id: 'chapter-li-develop-724',
        title: '研制军用计算机724机',
        problem: '20世纪70年代，我国高校大型计算机研制持续推进。',
        action: '李三立曾负责研制724机。',
        significance:
          '中国工程院记载，724机是20世纪70年代我国各大学中用于国家尖端科技规模最大的计算机。',
      },
      {
        id: 'chapter-li-ziqiang-supercomputers',
        title: '推进“自强”高性能计算机',
        problem:
          '国内高性能计算与网格技术基础薄弱，高校科研需要自主算力平台。',
        action:
          '他带领团队研制自强2000和自强3000，并建设上海高校网格平台。',
        significance:
          '自强3000于2004年列全球超级计算机TOP500第126位，展现了自主高性能计算平台的建设成果。',
      },
    ],
  },
  {
    id: 'scientist-huang-hongjia',
    slug: 'huang-hongjia',
    name: '黄宏嘉',
    years: '1924—2021',
    identity: '中国科学院院士，微波与光波导学家',
    summary:
      '长期研究微波与光纤传输，完成理论奠基、实验室建设和国产单模光纤探索。',
    fields: ['微波技术', '光波导', '光纤通信'],
    spiritIds: [
      'spirit-patriotism',
      'spirit-innovation',
      'spirit-dedication',
    ],
    portrait: '/images/scientists/huang-hongjia.webp',
    featured: true,
    chapters: [
      {
        id: 'chapter-huang-microwave-principles',
        title: '写成《微波原理》',
        problem:
          '当时国内微波电子学缺少系统专著，学术研究与工程应用都需要理论支撑。',
        action:
          '20世纪60年代，他把多年学习、实验和思考整理成约百万字的《微波原理》，由科学出版社出版。',
        significance:
          '该书成为国内该领域第一本专著，被国际学界称为一本“为中国人争气的书”。',
      },
      {
        id: 'chapter-huang-from-microwave-to-light',
        title: '从微波走向光波导',
        problem:
          '光纤通信尚处探索阶段，需要建立从微波波导延伸到光波导的理论认识。',
        action:
          '他发表《从微波到光》，论证微波波导向光波导的发展，并创立“超模式”概念。',
        significance:
          '相关工作为国内光纤通信研究提供理论基础，完善了模式耦合理论体系。',
      },
      {
        id: 'chapter-huang-single-mode-fiber',
        title: '探索国产单模光纤',
        problem:
          '单模光纤更有发展前景，但研制难度高，国内缺少实验基础。',
        action:
          '1979年，他在上海科学技术大学创建波科学研究实验室；此后带领团队并与上海石英厂等单位合作开展单模光纤研究，研制出我国第一根单模光纤。',
        significance:
          '团队于1980年前后研制出中国的单模光纤，推动我国光纤技术应用与发展。',
      },
    ],
  },
  {
    id: 'scientist-sun-jinliang',
    slug: 'sun-jinliang',
    name: '孙晋良',
    years: '1946年生',
    identity: '中国工程院院士，复合材料专家',
    summary:
      '长期从事碳/碳复合材料、特种纤维及特种纺织材料研究，相关成果应用于劳动防护、航空、航天等领域。',
    fields: ['复合材料', '特种纤维', '产业用纺织材料'],
    spiritIds: ['spirit-innovation'],
    portrait: '/images/scientists/sun-jinliang.webp',
    featured: false,
    chapters: [],
  },
  {
    id: 'scientist-zhou-bangxin',
    slug: 'zhou-bangxin',
    name: '周邦新',
    years: '1935年生',
    identity: '中国工程院院士，核材料与核燃料元件专家',
    summary:
      '长期研究锆合金、镍基高温合金、压力壳钢和核燃料元件，解决核工程材料关键问题。',
    fields: ['核材料', '核燃料元件', '金属材料'],
    spiritIds: [
      'spirit-patriotism',
      'spirit-truth-seeking',
      'spirit-dedication',
    ],
    portrait: '/images/scientists/zhou-bangxin.webp',
    featured: false,
    chapters: [],
  },
  {
    id: 'scientist-yang-xiongli',
    slug: 'yang-xiongli',
    name: '杨雄里',
    years: '1941年生',
    identity: '中国科学院院士，神经生物学家',
    summary:
      '长期研究视觉神经机制，并参与推动我国脑科学与类脑研究的战略规划。',
    fields: ['神经生物学', '视觉神经机制', '脑科学'],
    spiritIds: ['spirit-innovation', 'spirit-truth-seeking'],
    portrait: '/images/scientists/yang-xiongli.webp',
    featured: false,
    chapters: [],
  },
  {
    id: 'scientist-xie-shaorong',
    slug: 'xie-shaorong',
    name: '谢少荣',
    years: '',
    identity: '上海大学教授，海洋智能无人艇研究者',
    summary:
      '带领团队深耕海洋智能无人艇，研制“精海”系列无人艇并开展无人艇集群研究。',
    fields: ['海洋智能装备', '无人艇', '集群协同'],
    spiritIds: [
      'spirit-patriotism',
      'spirit-innovation',
      'spirit-collaboration',
    ],
    portrait: '/images/scientists/xie-shaorong.webp',
    featured: false,
    chapters: [],
  },
  {
    id: 'scientist-yue-xiaodong',
    slug: 'yue-xiaodong',
    name: '岳晓冬',
    years: '',
    identity: '上海大学教授，人工智能与机器学习研究者',
    summary:
      '从事人工智能理论与应用研究，研究方向为机器学习、软计算与决策支持系统。',
    fields: ['机器学习', '软计算', '决策支持系统'],
    spiritIds: ['spirit-innovation', 'spirit-truth-seeking'],
    portrait: '/images/scientists/yue-xiaodong.webp',
    featured: false,
    chapters: [],
  },
];

export const stories: Story[] = [
  {
    id: 'story-qian-from-literature-to-mechanics',
    slug: 'qian-from-literature-to-mechanics',
    title: '从义理到物理',
    summary: '一次专业转向，如何成为贯穿一生的科学报国选择。',
    scientistIds: ['scientist-qian-weichang'],
    spiritIds: ['spirit-patriotism', 'spirit-truth-seeking'],
  },
  {
    id: 'story-li-building-chinese-computers',
    slug: 'li-building-chinese-computers',
    title: '为祖国造“超级大脑”',
    summary:
      '从研制724机到建设“自强”高性能计算平台，持续推动我国计算机事业发展。',
    scientistIds: ['scientist-li-sanli'],
    spiritIds: ['spirit-collaboration', 'spirit-dedication'],
  },
  {
    id: 'story-huang-light-through-glass',
    slug: 'huang-light-through-glass',
    title: '让光在玻璃丝中远行',
    summary: '从微波理论到单模光纤，把长期基础研究推向通信实践。',
    scientistIds: ['scientist-huang-hongjia'],
    spiritIds: ['spirit-innovation', 'spirit-dedication'],
  },
];
