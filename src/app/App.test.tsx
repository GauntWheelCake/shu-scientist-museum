import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

it('renders the museum landmark', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});
