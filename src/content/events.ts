import type { TimelineEvent } from './types';

export const events: TimelineEvent[] = [
  {
    id: 'event-qian-return-1946',
    dateLabel: '1946年5月',
    title: '钱伟长回国任教',
    description: '钱伟长从洛杉矶乘船回国，随后回到清华大学任教。',
    scientistIds: ['scientist-qian-weichang'],
    spiritIds: ['spirit-patriotism', 'spirit-education'],
  },
  {
    id: 'event-li-911-1964',
    dateLabel: '1964年3月',
    title: '911电子管计算机投入运行',
    description:
      '经系统排查和调试，快速通用电子数字计算机911机在清华大学研制成功并投入运行。',
    scientistIds: ['scientist-li-sanli'],
    spiritIds: ['spirit-truth-seeking', 'spirit-collaboration'],
  },
  {
    id: 'event-huang-microwave-1964',
    dateLabel: '1964年',
    title: '《微波原理》出版',
    description: '黄宏嘉编写的《微波原理》由科学出版社出版。',
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
