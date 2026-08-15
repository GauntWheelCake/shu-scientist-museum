import { scientists } from '../content/scientists';

export const SITE_NAME = '上海大学科学家精神数字展馆';

export type PageMeta = {
  title: string;
  description: string;
};

const staticMeta: Record<string, PageMeta> = {
  '/': {
    title: SITE_NAME,
    description: '从上海大学科学家的真实档案、科研选择与育人实践中，读懂科技报国的精神力量。',
  },
  '/scientists': {
    title: `前辈群像｜${SITE_NAME}`,
    description: '浏览上海大学科学家人物档案，按研究领域与科学家精神主题发现人物故事。',
  },
  '/timeline': {
    title: `岁月长河｜${SITE_NAME}`,
    description: '沿已核实的时间节点，回看科学选择、科研成果与上海大学发展的交汇。',
  },
  '/spirit': {
    title: `精神谱系｜${SITE_NAME}`,
    description: '从爱国、创新、求实、奉献、协同和育人六类主题理解科学家精神。',
  },
  '/graph': {
    title: `科学家图谱｜${SITE_NAME}`,
    description: '探索人物、科学事件与精神主题之间有资料依据的关联。',
  },
  '/footprints': {
    title: `精神足迹｜${SITE_NAME}`,
    description: '查看社会实践计划与已完成记录，计划状态和核实数据分开展示。',
  },
  '/media': {
    title: `影音档案｜${SITE_NAME}`,
    description: '查看已核实发布和仍在征集整理中的科学家精神影音资料。',
  },
  '/about': {
    title: `关于项目｜${SITE_NAME}`,
    description: '了解上海大学科学家精神数字展馆的项目定位、内容边界与维护原则。',
  },
};

const notFoundMeta: PageMeta = {
  title: `页面未找到｜${SITE_NAME}`,
  description: '未找到对应的展馆页面，可返回首页或前辈群像继续参观。',
};

function normalizePathname(pathname: string): string {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || '/';
  const decoded = (() => {
    try {
      return decodeURIComponent(withoutQuery);
    } catch {
      return withoutQuery;
    }
  })();

  return decoded.length > 1 ? decoded.replace(/\/+$/, '') : decoded;
}

export function getPageMeta(pathname: string): PageMeta {
  const normalized = normalizePathname(pathname);
  const scientistMatch = normalized.match(/^\/scientists\/([^/]+)$/);

  if (scientistMatch) {
    const scientist = scientists.find((candidate) => candidate.slug === scientistMatch[1]);

    if (scientist) {
      return {
        title: `${scientist.name}｜${SITE_NAME}`,
        description: `${scientist.name}：${scientist.summary}`,
      };
    }
  }

  return staticMeta[normalized] ?? notFoundMeta;
}
