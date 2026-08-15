import type { ArchiveItem } from './types';

export const archives: ArchiveItem[] = [
  {
    id: 'archive-qian-courseware',
    title: '钱伟长主题宣讲课件',
    kind: 'document',
    description: '围绕钱伟长从文史转向物理、留学研究、归国任教与教育改革展开。',
    image: '/images/archives/qian-courseware.webp',
    alt: '钱伟长主题宣讲课件封面',
    scientistIds: ['scientist-qian-weichang'],
    spiritIds: ['spirit-patriotism', 'spirit-education'],
  },
  {
    id: 'archive-li-courseware',
    title: '李三立主题宣讲课件',
    kind: 'document',
    description: '围绕911机、724机和“自强”系列高性能计算机展开。',
    image: '/images/archives/li-courseware.webp',
    alt: '李三立主题宣讲课件封面',
    scientistIds: ['scientist-li-sanli'],
    spiritIds: ['spirit-collaboration', 'spirit-dedication'],
  },
  {
    id: 'archive-huang-courseware',
    title: '黄宏嘉主题宣讲课件',
    kind: 'document',
    description: '围绕微波理论、光波导研究和国产单模光纤探索展开。',
    image: '/images/archives/huang-courseware.webp',
    alt: '黄宏嘉主题宣讲课件封面',
    scientistIds: ['scientist-huang-hongjia'],
    spiritIds: ['spirit-innovation', 'spirit-dedication'],
  },
];
