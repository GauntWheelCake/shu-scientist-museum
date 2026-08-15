import ciSource from '../../.github/workflows/ci.yml?raw';
import deploySource from '../../.github/workflows/deploy-pages.yml?raw';

type Workflow = {
  on: Record<string, unknown>;
  permissions?: Record<string, string>;
  jobs: Record<
    string,
    {
      if?: string;
      needs?: string;
      permissions?: Record<string, string>;
      steps: Array<{
        uses?: string;
        run?: string;
        env?: Record<string, string>;
        with?: Record<string, string>;
      }>;
    }
  >;
};

const workflowSources = {
  'ci.yml': ciSource,
  'deploy-pages.yml': deploySource,
} as const;

const readWorkflow = (name: keyof typeof workflowSources) =>
  JSON.parse(workflowSources[name]) as Workflow;

const uses = (workflow: Workflow, job: string) =>
  workflow.jobs[job].steps.map((step) => step.uses).filter(Boolean);

const runs = (workflow: Workflow, job: string) =>
  workflow.jobs[job].steps.map((step) => step.run).filter(Boolean);

describe('GitHub workflow contracts', () => {
  it('runs the complete quality gate with Node 22 for pull requests and main pushes', () => {
    const workflow = readWorkflow('ci.yml');
    const quality = workflow.jobs.quality;

    expect(workflow.on).toEqual({
      pull_request: {},
      push: { branches: ['main'] },
    });
    expect(uses(workflow, 'quality')).toContain('actions/checkout@v4');
    expect(uses(workflow, 'quality')).toContain('actions/setup-node@v4');
    expect(quality.steps.find((step) => step.uses === 'actions/setup-node@v4')?.with).toMatchObject({
      'node-version': '22',
      cache: 'npm',
      'cache-dependency-path': 'package-lock.json',
    });
    expect(runs(workflow, 'quality')).toEqual(['npm ci', 'npm run check']);
  });

  it('builds and deploys only main with the repository Pages base path', () => {
    const workflow = readWorkflow('deploy-pages.yml');
    const build = workflow.jobs.build;
    const deploy = workflow.jobs.deploy;

    expect(workflow.on).toEqual({
      push: { branches: ['main'] },
      workflow_dispatch: {},
    });
    expect(workflow.permissions).toMatchObject({
      contents: 'read',
      pages: 'write',
      'id-token': 'write',
    });
    expect(build.if).toBe("github.ref == 'refs/heads/main'");
    expect(uses(workflow, 'build')).toEqual(
      expect.arrayContaining([
        'actions/checkout@v4',
        'actions/setup-node@v4',
        'actions/configure-pages@v5',
        'actions/upload-pages-artifact@v3',
      ]),
    );
    expect(build.steps.find((step) => step.run === 'npm run build')?.env).toEqual({
      VITE_BASE_PATH: '/shu-scientist-museum/',
    });
    expect(build.steps.find((step) => step.uses === 'actions/upload-pages-artifact@v3')?.with).toMatchObject({
      path: 'dist',
    });
    expect(deploy.needs).toBe('build');
    expect(uses(workflow, 'deploy')).toContain('actions/deploy-pages@v4');
  });
});
