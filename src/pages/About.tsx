import { type JSX } from 'react';
import { getPageMeta } from '../app/site-meta';
import { PageIntro } from '../components/common/PageIntro';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const practiceChain = ['事迹挖掘', '内容创作', '全域宣讲', '数字传播'];

export function About(): JSX.Element {
  useDocumentTitle(getPageMeta('/about'));

  return (
    <>
      <PageIntro
        eyebrow="项目说明"
        title="关于项目"
        description="一项从校史资源出发、以数字传播延展科学家精神教育的社会实践项目。"
      />
      <section className="about-page" aria-labelledby="about-positioning-title">
        <article className="about-page__positioning">
          <p>项目定位</p>
          <h2 id="about-positioning-title">追寻前辈榜样，筑梦科技自立自强</h2>
          <p>
            项目聚焦上海大学老一辈科研工作者的科研事迹，以科学家精神宣讲为主题，是计算机工程与科学学院持续建设的常态化思政实践品牌。
          </p>
        </article>

        <section className="about-page__chain" aria-labelledby="about-chain-title">
          <div>
            <p>实践链条</p>
            <h2 id="about-chain-title">事迹挖掘—内容创作—全域宣讲—数字传播</h2>
          </div>
          <ol>
            {practiceChain.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>

        <section className="about-page__team" aria-labelledby="about-team-title">
          <p>申报信息</p>
          <h2 id="about-team-title">项目团队</h2>
          <ul>
            <li>项目团队共 11 人</li>
            <li>项目负责人：张富华</li>
            <li>指导教师：唐明</li>
            <li>实践地点：上海市</li>
          </ul>
        </section>
      </section>
    </>
  );
}
