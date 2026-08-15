import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { About } from './About';

it('presents only confirmed project positioning, practice chain, and team facts', () => {
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  );

  expect(screen.getByText(/计算机工程与科学学院/)).toBeVisible();
  expect(screen.getByText('事迹挖掘—内容创作—全域宣讲—数字传播')).toBeVisible();
  expect(screen.getByText('项目团队共 11 人')).toBeVisible();
  expect(screen.queryByText(/@|电话|邮箱|联系/)).not.toBeInTheDocument();
});
