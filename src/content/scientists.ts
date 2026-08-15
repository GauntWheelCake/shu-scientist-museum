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
        id: 'chapter-qian-aerospace-research',
        title: '航空太空领域研究',
        problem:
          '航空太空领域需要以力学研究飞行与结构中的复杂问题。',
        action:
          '他留学美国加州理工大学，在冯·卡门教授指导下从事航空太空领域研究。',
        significance:
          '这段经历成为他应用数学与力学科研生涯的重要阶段。',
      },
      {
        id: 'chapter-qian-shell-mechanics',
        title: '板壳内禀统一理论',
        problem:
          '航空与工程结构研究需要更统一地描述板壳受力和变形。',
        action:
          '在北美深造期间，他从事航空太空领域研究，推导板壳内禀统一理论，相关成果被称为“钱伟长方程”。',
        significance:
          '这项工作成为其应用数学与力学研究的重要代表成果。',
      },
      {
        id: 'chapter-qian-solid-fluid-mechanics',
        title: '从固体到流体的应用力学探索',
        problem:
          '应用数学与力学面对的工程对象跨越固体与流体，需要持续拓展研究视野。',
        action:
          '他长期从事应用数学与力学研究，研究跨度从固体延伸到流体。',
        significance:
          '他成为我国近代应用数学与力学的奠基人之一。',
      },
    ],
  },
  {
    id: 'scientist-li-sanli',
    slug: 'li-sanli',
    name: '李三立',
    years: '2022年逝世',
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
        id: 'chapter-li-rescue-911',
        title: '抢救911电子管计算机',
        problem:
          '1961年接手时，911机插件没有测试档案，控制信号不稳，并存在大量焊接问题。',
        action:
          '他组织学生逐个测量插件、建立档案，并请焊接师傅排查出两百多处虚焊。',
        significance:
          '911机于1964年研制成功并投入运行，为后续通用计算机研发奠定基础。',
      },
      {
        id: 'chapter-li-develop-724',
        title: '研制军用计算机724机',
        problem:
          '火箭发射基地需要规模大、指标高且能实时监控飞行器和卫星的专用计算机。',
        action:
          '他带领团队承担数百块印刷板和集成电路模块的研制与全机稳定性调试。',
        significance:
          '724机完成多项重要国防任务，成为当时高校用于尖端科研计算的大型计算机。',
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
    years: '1924年生',
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
          '他把多年学习、实验和思考整理成约百万字的《微波原理》，于1964年出版。',
        significance:
          '该书成为国内该领域第一本专著，被国际学界评价为“为中国人争气的书”。',
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
          '他创建波科学研究实验室，带领团队反复试验，并曾在家中煤气灶上拉制光纤雏形。',
        significance:
          '团队于1980年前后研制出中国的单模光纤，推动我国光纤技术应用与发展。',
      },
      {
        id: 'chapter-huang-wave-plate',
        title: '提出“黄氏波片”',
        problem:
          '光纤中的偏振状态会影响信号传输的质量和稳定性。',
        action:
          '他提出用于调控光偏振状态的波片方案，相关成果被称为“黄氏波片”。',
        significance:
          '该成果获得国际同行认可，成为其光纤研究的代表性贡献之一。',
      },
    ],
  },
  {
    id: 'scientist-sun-jinliang',
    slug: 'sun-jinliang',
    name: '孙晋良',
    years: '',
    identity: '中国工程院院士，复合材料专家',
    summary:
      '长期从事碳/碳复合材料、特种纤维和产业用纺织材料研发，推动关键材料自主可控。',
    fields: ['复合材料', '特种纤维', '产业用纺织材料'],
    spiritIds: [
      'spirit-patriotism',
      'spirit-innovation',
      'spirit-collaboration',
    ],
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
    years: '1935年生',
    identity: '中国科学院院士，神经生物学家',
    summary:
      '长期研究视觉神经机制，并参与推动我国脑科学与类脑研究的战略规划。',
    fields: ['神经生物学', '视觉神经机制', '脑科学'],
    spiritIds: [
      'spirit-innovation',
      'spirit-truth-seeking',
      'spirit-education',
    ],
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
      '带领团队深耕海洋智能无人艇，形成“精海”系列产品并开展无人艇集群研究。',
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
      '从机器学习理论走向产学研融合，关注多模态识别、迁移学习和真实场景应用。',
    fields: ['机器学习', '多模态识别', '人工智能应用'],
    spiritIds: [
      'spirit-innovation',
      'spirit-truth-seeking',
      'spirit-education',
    ],
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
    summary: '从排查虚焊到建设高性能计算平台，见证中国计算机从无到有。',
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
