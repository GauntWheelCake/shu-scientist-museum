export type SourceKind = 'historical-photo' | 'courseware-cover';

export type SourceRecord = {
  id: string;
  kind: SourceKind;
  assetPath: string;
  sourceFile: string;
  locator: `slide ${number}` | `page ${number}`;
  usage: string;
  alt: string;
};

export const sources: SourceRecord[] = [
  {
    id: 'source-qian-portrait',
    kind: 'historical-photo',
    assetPath: '/images/scientists/qian-weichang.webp',
    sourceFile: '演讲ppt/钱伟长：从偏科少年到力学大师.pptx',
    locator: 'slide 2',
    usage: '钱伟长人物卡片与人物专题肖像',
    alt: '钱伟长肖像',
  },
  {
    id: 'source-li-portrait',
    kind: 'historical-photo',
    assetPath: '/images/scientists/li-sanli.webp',
    sourceFile: '演讲ppt/李三立：造国产超级计算机.pptx',
    locator: 'slide 2',
    usage: '李三立人物卡片与人物专题肖像',
    alt: '李三立肖像',
  },
  {
    id: 'source-huang-laboratory-photo',
    kind: 'historical-photo',
    assetPath: '/images/scientists/huang-hongjia.webp',
    sourceFile: '演讲ppt/黄宏嘉：一根光纤连通万家 (1).pptx',
    locator: 'slide 3',
    usage: '黄宏嘉人物卡片与人物专题照片',
    alt: '黄宏嘉在实验室设备旁向学生讲解',
  },
  {
    id: 'source-qian-courseware',
    kind: 'courseware-cover',
    assetPath: '/images/archives/source-qian-courseware-2026.webp',
    sourceFile: '演讲ppt/钱伟长：从偏科少年到力学大师.pptx',
    locator: 'slide 1',
    usage: '钱伟长主题宣讲课件档案封面',
    alt: '钱伟长主题宣讲课件封面',
  },
  {
    id: 'source-li-courseware',
    kind: 'courseware-cover',
    assetPath: '/images/archives/source-li-courseware-2026.webp',
    sourceFile: '演讲ppt/李三立：造国产超级计算机.pptx',
    locator: 'slide 1',
    usage: '李三立主题宣讲课件档案封面',
    alt: '李三立主题宣讲课件封面',
  },
  {
    id: 'source-huang-courseware',
    kind: 'courseware-cover',
    assetPath: '/images/archives/source-huang-courseware-2026.webp',
    sourceFile: '演讲ppt/黄宏嘉：一根光纤连通万家 (1).pptx',
    locator: 'slide 1',
    usage: '黄宏嘉主题宣讲课件档案封面',
    alt: '黄宏嘉主题宣讲课件封面',
  },
];
