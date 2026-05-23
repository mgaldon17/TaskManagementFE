import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const renderWithAuth = (ui) => render(<AuthProvider>{ui}</AuthProvider>);

test('renders login form when not authenticated', () => {
  renderWithAuth(<App />);
  const heading = screen.getByRole('heading', { name: /task manager/i });
  expect(heading).toBeInTheDocument();
});
