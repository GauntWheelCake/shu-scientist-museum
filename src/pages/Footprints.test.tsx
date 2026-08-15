import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Footprints } from './Footprints';

describe('Footprints', () => {
  it('offers all four validated practice-route filters and shows the selected route', async () => {
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

    await user.click(screen.getByRole('button', { name: '进社区' }));

    expect(screen.getByRole('button', { name: '进社区' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: /进社区/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /进军营/ })).not.toBeInTheDocument();
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
