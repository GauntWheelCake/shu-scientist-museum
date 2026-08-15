import type {
  ContentDataset,
  ValidationIssue,
  ValidationIssueCode,
} from './types';

const CORE_SCIENTISTS = [
  'scientist-qian-weichang',
  'scientist-li-sanli',
  'scientist-huang-hongjia',
] as const;

const issue = (
  code: ValidationIssueCode,
  path: string,
  message: string,
): ValidationIssue => ({ code, path, message });

export const validateContent = (dataset: ContentDataset): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const idPaths = new Map<string, string>();
  const slugPaths = new Map<string, string>();
  const collections = [
    ['scientists', dataset.scientists],
    ['stories', dataset.stories],
    ['events', dataset.events],
    ['archives', dataset.archives],
    ['activities', dataset.activities],
    ['media', dataset.media],
    ['spiritThemes', dataset.spiritThemes],
  ] as const;

  for (const [collectionName, records] of collections) {
    records.forEach((record, index) => {
      const path = `${collectionName}[${index}].id`;
      const firstPath = idPaths.get(record.id);
      if (firstPath) {
        issues.push(
          issue(
            'DUPLICATE_ID',
            path,
            `ID “${record.id}” 已在 ${firstPath} 使用。`,
          ),
        );
      } else {
        idPaths.set(record.id, path);
      }
    });
  }

  dataset.scientists.forEach((scientist, scientistIndex) => {
    scientist.chapters.forEach((chapter, chapterIndex) => {
      const path = `scientists[${scientistIndex}].chapters[${chapterIndex}].id`;
      const firstPath = idPaths.get(chapter.id);
      if (firstPath) {
        issues.push(
          issue(
            'DUPLICATE_ID',
            path,
            `ID “${chapter.id}” 已在 ${firstPath} 使用。`,
          ),
        );
      } else {
        idPaths.set(chapter.id, path);
      }
    });
  });

  const slugRecords = [
    ...dataset.scientists.map(({ slug }, index) => ({
      slug,
      path: `scientists[${index}].slug`,
    })),
    ...dataset.stories.map(({ slug }, index) => ({
      slug,
      path: `stories[${index}].slug`,
    })),
  ];
  slugRecords.forEach(({ slug, path }) => {
    const firstPath = slugPaths.get(slug);
    if (firstPath) {
      issues.push(
        issue(
          'DUPLICATE_SLUG',
          path,
          `Slug “${slug}” 已在 ${firstPath} 使用。`,
        ),
      );
    } else {
      slugPaths.set(slug, path);
    }
  });

  const featuredScientistIds = new Set(
    dataset.scientists
      .filter(({ featured }) => featured)
      .map(({ id }) => id),
  );
  CORE_SCIENTISTS.forEach((scientistId) => {
    if (!featuredScientistIds.has(scientistId)) {
      issues.push(
        issue(
          'MISSING_FEATURED_SCIENTIST',
          'scientists',
          `缺少核心人物 ${scientistId}，或该人物未标记为 featured。`,
        ),
      );
    }
  });

  const scientistIds = new Set(dataset.scientists.map(({ id }) => id));
  const spiritIds = new Set(dataset.spiritThemes.map(({ id }) => id));
  const referenceRecords = [
    ...dataset.scientists.map((record, index) => ({
      path: `scientists[${index}]`,
      record,
    })),
    ...dataset.stories.map((record, index) => ({
      path: `stories[${index}]`,
      record,
    })),
    ...dataset.events.map((record, index) => ({
      path: `events[${index}]`,
      record,
    })),
    ...dataset.archives.map((record, index) => ({
      path: `archives[${index}]`,
      record,
    })),
    ...dataset.activities.map((record, index) => ({
      path: `activities[${index}]`,
      record,
    })),
    ...dataset.media.map((record, index) => ({
      path: `media[${index}]`,
      record,
    })),
  ];

  referenceRecords.forEach(({ path, record }) => {
    if ('scientistIds' in record) {
      record.scientistIds.forEach((scientistId, referenceIndex) => {
        if (!scientistIds.has(scientistId)) {
          issues.push(
            issue(
              'BROKEN_REFERENCE',
              `${path}.scientistIds[${referenceIndex}]`,
              `关联人物 ${scientistId} 不存在。`,
            ),
          );
        }
      });
    }

    record.spiritIds.forEach((spiritId, referenceIndex) => {
      if (!spiritIds.has(spiritId)) {
        issues.push(
          issue(
            'BROKEN_REFERENCE',
            `${path}.spiritIds[${referenceIndex}]`,
            `关联精神主题 ${spiritId} 不存在。`,
          ),
        );
      }
    });
  });

  dataset.media.forEach((item, index) => {
    if (item.status === 'published' && !item.url?.trim()) {
      issues.push(
        issue(
          'PUBLISHED_MEDIA_WITHOUT_URL',
          `media[${index}].url`,
          '已发布影音必须提供可访问 URL。',
        ),
      );
    }
  });

  dataset.activities.forEach((activity, index) => {
    if (activity.participantCount < 0) {
      issues.push(
        issue(
          'NEGATIVE_PARTICIPANT_COUNT',
          `activities[${index}].participantCount`,
          '活动人数不能为负数。',
        ),
      );
    }
  });

  [...dataset.archives, ...dataset.media].forEach((item, index) => {
    if (item.image.trim() && !item.alt.trim()) {
      const collection = index < dataset.archives.length ? 'archives' : 'media';
      const itemIndex =
        collection === 'archives' ? index : index - dataset.archives.length;
      issues.push(
        issue(
          'MISSING_ALT_TEXT',
          `${collection}[${itemIndex}].alt`,
          '图片必须提供替代文本。',
        ),
      );
    }
  });

  return issues;
};
