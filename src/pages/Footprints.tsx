import { useMemo, useState, type JSX } from 'react';
import { PageIntro } from '../components/common/PageIntro';
import { ResilientImage } from '../components/common/ResilientImage';
import { activities } from '../content/activities';
import { scientists } from '../content/scientists';
import type { ActivityType } from '../content/types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const activityFilters: Array<{ id: 'all' | ActivityType; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'branch', label: '进支部' },
  { id: 'school', label: '进校园' },
  { id: 'community', label: '进社区' },
  { id: 'military', label: '进军营' },
];

const activityTypeLabels: Record<ActivityType, string> = {
  branch: '进支部',
  school: '进校园',
  community: '进社区',
  military: '进军营',
};

export function Footprints(): JSX.Element {
  useDocumentTitle('精神足迹｜上海大学科学家精神主题宣传馆');
  const [selectedType, setSelectedType] = useState<'all' | ActivityType>('all');
  const displayedActivities = useMemo(
    () => activities.filter((activity) => selectedType === 'all' || activity.type === selectedType),
    [selectedType],
  );
  const completedParticipants = activities
    .filter((activity) => activity.status === 'completed')
    .reduce((total, activity) => total + activity.participantCount, 0);

  return (
    <>
      <PageIntro
        eyebrow="社会实践"
        title="精神足迹"
        description="以地点索引串联已整理的实践路线；计划与完成状态、人数记录均分开展示。"
      />
      <section className="footprints-page" aria-labelledby="footprints-title">
        <div className="footprints-page__heading">
          <div>
            <p>地点索引</p>
            <h2 id="footprints-title">实践路线</h2>
          </div>
          <dl className="footprints-summary">
            <div>
              <dt>已核实覆盖人数</dt>
              <dd aria-label="已核实覆盖人数">{completedParticipants}</dd>
            </div>
            <div>
              <dt>当前收录路线</dt>
              <dd>{activities.length}</dd>
            </div>
          </dl>
        </div>

        <div className="footprints-filter" role="group" aria-label="实践路线筛选">
          {activityFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={selectedType === filter.id}
              onClick={() => setSelectedType(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <ol className="footprints-index" aria-label="实践地点索引">
          {displayedActivities.map((activity, index) => (
            <li key={activity.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{activity.location}</strong>
            </li>
          ))}
        </ol>

        <div className="activity-card-grid">
          {displayedActivities.map((activity) => {
            const relatedScientists = activity.scientistIds
              .map((scientistId) => scientists.find((scientist) => scientist.id === scientistId)?.name)
              .filter((name): name is string => Boolean(name));

            return (
              <article key={activity.id} className="activity-card">
                <ResilientImage
                  className="activity-card__image"
                  src={activity.image.src}
                  alt={activity.image.alt}
                  fallbackLabel={activity.title}
                />
                <div className="activity-card__content">
                  <div className="activity-card__meta">
                    <span>{activityTypeLabels[activity.type]}</span>
                    <span>{activity.status === 'completed' ? '已完成' : '计划中'}</span>
                  </div>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <dl>
                    <div>
                      <dt>时间</dt>
                      <dd>{activity.dateLabel}</dd>
                    </div>
                    <div>
                      <dt>地点</dt>
                      <dd>{activity.location}</dd>
                    </div>
                    <div>
                      <dt>关联人物</dt>
                      <dd>{relatedScientists.join('、')}</dd>
                    </div>
                    {activity.status === 'completed' ? (
                      <div>
                        <dt>已核实参与人数</dt>
                        <dd>{activity.participantCount} 人</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
