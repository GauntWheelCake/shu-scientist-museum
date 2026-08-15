import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Footprints } from './Footprints';

describe('Footprints', () => {
  it('filters every validated practice route to its own activity', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Footprints />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: '全部' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '进支部' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '进校园' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '进社区' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '进军营' })).toBeInTheDocument();

    const routeCases = [
      { label: '进支部', title: '科学家精神进支部（计划）' },
      { label: '进校园', title: '科学家精神进校园（计划）' },
      { label: '进社区', title: '科学家精神进社区（计划）' },
      { label: '进军营', title: '科学家精神进军营（计划）' },
    ];

    for (const routeCase of routeCases) {
      await user.click(screen.getByRole('button', { name: routeCase.label }));

      expect(screen.getByRole('button', { name: routeCase.label })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByRole('heading', { name: routeCase.title })).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(1);

      for (const otherRoute of routeCases.filter((item) => item.label !== routeCase.label)) {
        expect(screen.queryByRole('heading', { name: otherRoute.title })).not.toBeInTheDocument();
      }
    }
  });

  it('only totals completed participants and keeps planned routes out of results', () => {
    render(
      <MemoryRouter>
        <Footprints />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('已核实覆盖人数')).toHaveTextContent('0');
    expect(screen.getAllByText('计划中')).toHaveLength(4);
    expect(screen.queryByText(/已覆盖\s*0\s*人/)).not.toBeInTheDocument();
  });

  it('replaces a failed activity image with an honest fallback', () => {
    render(
      <MemoryRouter>
        <Footprints />
      </MemoryRouter>,
    );

    const image = screen.getByRole('img', { name: '科学家精神进支部计划示意图' });
    fireEvent.error(image);

    expect(screen.queryByRole('img', { name: '科学家精神进支部计划示意图' })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: '科学家精神进支部计划示意图暂缺' })).toBeVisible();
  });
});
