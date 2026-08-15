export type Scientist = {
  id: string;
  slug: string;
  name: string;
  /** 空字符串表示现有资料未确认生卒年份；消费组件必须条件渲染。 */
  years: string;
  identity: string;
  summary: string;
  fields: string[];
  spiritIds: string[];
  portrait: string;
  featured: boolean;
  chapters: Array<{
    id: string;
    title: string;
    problem: string;
    action: string;
    significance: string;
  }>;
};

export type Story = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  scientistIds: string[];
  spiritIds: string[];
};

export type TimelineEvent = {
  id: string;
  dateLabel: string;
  title: string;
  description: string;
  scientistIds: string[];
  spiritIds: string[];
};

export type ArchiveItem = {
  id: string;
  title: string;
  kind: 'document' | 'photo' | 'object';
  year: string;
  sourceId: string;
  description: string;
  image: string;
  alt: string;
  scientistIds: string[];
  spiritIds: string[];
};

export type ActivityType = 'branch' | 'school' | 'community' | 'military';

export type SourcedImage = {
  src: string;
  alt: string;
  sourceId: string;
};

export type Activity = {
  id: string;
  title: string;
  dateLabel: string;
  location: string;
  description: string;
  participantCount: number;
  status: 'planned' | 'completed';
  type: ActivityType;
  image: SourcedImage;
  scientistIds: string[];
  spiritIds: string[];
};

export type MediaItem = {
  id: string;
  title: string;
  kind: 'audio' | 'video';
  status: 'published' | 'collecting';
  description: string;
  platform?: string;
  url?: string;
  image: string;
  alt: string;
  scientistIds: string[];
  spiritIds: string[];
};

export type SpiritTheme = {
  id: string;
  title: string;
  summary: string;
  keywords: string[];
};

export type ContentDataset = {
  scientists: Scientist[];
  stories: Story[];
  events: TimelineEvent[];
  archives: ArchiveItem[];
  activities: Activity[];
  media: MediaItem[];
  spiritThemes: SpiritTheme[];
};

export type ValidationIssueCode =
  | 'DUPLICATE_ID'
  | 'DUPLICATE_SLUG'
  | 'MISSING_FEATURED_SCIENTIST'
  | 'BROKEN_REFERENCE'
  | 'PUBLISHED_MEDIA_WITHOUT_URL'
  | 'PUBLISHED_MEDIA_WITHOUT_PLATFORM'
  | 'NEGATIVE_PARTICIPANT_COUNT'
  | 'MISSING_ALT_TEXT'
  | 'MISSING_IMAGE_SRC'
  | 'INVALID_SOURCE_ID'
  | 'INVALID_ACTIVITY_TYPE';

export type ValidationIssue = {
  code: ValidationIssueCode;
  path: string;
  message: string;
};
