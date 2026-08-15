import type { Activity } from './types';

const projectScientistIds = [
  'scientist-qian-weichang',
  'scientist-li-sanli',
  'scientist-huang-hongjia',
  'scientist-sun-jinliang',
  'scientist-zhou-bangxin',
  'scientist-yang-xiongli',
  'scientist-xie-shaorong',
  'scientist-yue-xiaodong',
];

export const activities: Activity[] = [
  {
    id: 'activity-branch-outreach-2026',
    title: '科学家精神进支部（计划）',
    dateLabel: '2026年7月（计划）',
    location: '上海大学宝山校区',
    description:
      '计划将科学家事迹整理为微党课、微团课，在党团支部开展宣讲；具体场次人数尚待核验。',
    participantCount: 0,
    status: 'planned',
    type: 'branch',
    image: {
      src: '/images/activities/2026-07-01-shanghai-university-01.webp',
      alt: '科学家精神进支部计划示意图',
      sourceId: 'source-practice-plan-branch',
    },
    scientistIds: projectScientistIds,
    spiritIds: ['spirit-patriotism', 'spirit-education'],
  },
  {
    id: 'activity-school-outreach-2026',
    title: '科学家精神进校园（计划）',
    dateLabel: '2026年7月（计划）',
    location: '上海大学附属小学等学校',
    description:
      '计划面向九年义务教育阶段学校开展科学家精神宣讲；具体场次人数尚待核验。',
    participantCount: 0,
    status: 'planned',
    type: 'school',
    image: {
      src: '/images/activities/2026-07-01-shanghai-university-affiliated-primary-school-01.webp',
      alt: '科学家精神进校园计划示意图',
      sourceId: 'source-practice-plan-school',
    },
    scientistIds: projectScientistIds,
    spiritIds: ['spirit-patriotism', 'spirit-education'],
  },
  {
    id: 'activity-community-outreach-2026',
    title: '科学家精神进社区（计划）',
    dateLabel: '2026年7月（计划）',
    location: '宝山区友谊路街道、普陀区真如街道',
    description:
      '计划在爱心暑托班、助老服务课等场合开展宣讲；具体场次人数尚待核验。',
    participantCount: 0,
    status: 'planned',
    type: 'community',
    image: {
      src: '/images/activities/2026-07-01-youyi-road-community-01.webp',
      alt: '科学家精神进社区计划示意图',
      sourceId: 'source-practice-plan-community',
    },
    scientistIds: projectScientistIds,
    spiritIds: ['spirit-patriotism', 'spirit-education'],
  },
  {
    id: 'activity-military-outreach-2026',
    title: '科学家精神进军营（计划）',
    dateLabel: '2026年7月（计划）',
    location: '南京路上好八连事迹纪念馆等',
    description: '计划面向部队开展科学家精神宣讲；具体场次人数尚待核验。',
    participantCount: 0,
    status: 'planned',
    type: 'military',
    image: {
      src: '/images/activities/2026-07-01-nanjing-road-memorial-01.webp',
      alt: '科学家精神进军营计划示意图',
      sourceId: 'source-practice-plan-military',
    },
    scientistIds: projectScientistIds,
    spiritIds: ['spirit-patriotism', 'spirit-education'],
  },
];
