import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { Spirit } from './Spirit';

function LocationProbe() {
  const location = useLocation();

  return <output aria-label="当前主题参数">{location.search}</output>;
}

function renderSpirit(entry = '/spirit') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Spirit />
      <LocationProbe />
    </MemoryRouter>,
  );
}

it('restores the chosen theme from the URL and only shows explicitly linked stories', () => {
  renderSpirit('/spirit?theme=spirit-patriotism');

  expect(screen.getByRole('button', { name: '胸怀祖国' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const stories = screen.getByRole('region', { name: '真实故事' });
  expect(within(stories).getByText('从义理到物理')).toBeVisible();
  expect(
    within(stories).queryByText('为祖国造“超级大脑”'),
  ).not.toBeInTheDocument();
  expect(
    within(stories).queryByText('让光在玻璃丝中远行'),
  ).not.toBeInTheDocument();
});

it('pushes the selected theme into the URL and gives themes without stories an honest state', async () => {
  const user = userEvent.setup();
  renderSpirit();

  await user.click(screen.getByRole('button', { name: '育人传承' }));

  expect(screen.getByLabelText('当前主题参数')).toHaveTextContent(
    '?theme=spirit-education',
  );
  expect(screen.getByRole('button', { name: '育人传承' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(screen.getByText('该主题的故事材料仍在持续整理中。')).toBeVisible();
  const people = screen.getByRole('region', { name: '关联人物' });
  expect(within(people).getByRole('link', { name: '钱伟长' })).toBeVisible();
  expect(within(people).getByRole('link', { name: '李三立' })).toBeVisible();
  expect(within(people).getByRole('link', { name: '杨雄里' })).toBeVisible();
});
