import type { TimelineEvent } from './types';

export const events: TimelineEvent[] = [
  {
    id: 'event-qian-return-1946',
    dateLabel: '1946年5月',
    title: '钱伟长回国任教',
    description: '1946年5月，钱伟长回国，随后任清华大学教授。',
    scientistIds: ['scientist-qian-weichang'],
    spiritIds: ['spirit-patriotism', 'spirit-education'],
  },
  {
    id: 'event-huang-microwave-1964',
    dateLabel: '20世纪60年代',
    title: '《微波原理》出版',
    description:
      '约百万字的《微波原理》由科学出版社出版，成为国内该领域第一本专著。',
    scientistIds: ['scientist-huang-hongjia'],
    spiritIds: ['spirit-truth-seeking', 'spirit-dedication'],
  },
  {
    id: 'event-huang-single-mode-1980',
    dateLabel: '1980年前后',
    title: '国产单模光纤研制取得进展',
    description: '黄宏嘉带领团队在反复实验中研制出中国的单模光纤。',
    scientistIds: ['scientist-huang-hongjia'],
    spiritIds: ['spirit-innovation', 'spirit-dedication'],
  },
  {
    id: 'event-shanghai-university-1994',
    dateLabel: '1994年',
    title: '新上海大学合并组建',
    description:
      '新上海大学合并组建，钱伟长担任首任校长；李三立此后长期担任计算机工程与科学学院院长。',
    scientistIds: ['scientist-qian-weichang', 'scientist-li-sanli'],
    spiritIds: ['spirit-education'],
  },
  {
    id: 'event-li-ziqiang-3000-2004',
    dateLabel: '2004年',
    title: '自强3000进入全球TOP500',
    description: '自强3000高性能计算机列全球超级计算机TOP500第126位。',
    scientistIds: ['scientist-li-sanli'],
    spiritIds: ['spirit-innovation', 'spirit-collaboration'],
  },
];
