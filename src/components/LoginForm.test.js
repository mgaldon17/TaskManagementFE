import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { AuthProvider } from '../context/AuthContext';
import LoginForm from './LoginForm';

jest.mock('axios');

const renderWithAuth = (ui) => render(<AuthProvider>{ui}</AuthProvider>);

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  delete axios.defaults.headers.common['Authorization'];
});

test('renders login form with heading', () => {
  renderWithAuth(<LoginForm />);
  expect(screen.getByRole('heading', { name: /task manager/i })).toBeInTheDocument();
});

test('shows error when fields are empty', async () => {
  renderWithAuth(<LoginForm />);
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(screen.getByText('Username and password are required')).toBeInTheDocument();
});

test('shows invalid credentials on 401', async () => {
  axios.get.mockRejectedValue({ response: { status: 401 } });
  renderWithAuth(<LoginForm />);

  await userEvent.type(screen.getByLabelText(/username/i), 'wrong');
  await userEvent.type(screen.getByLabelText(/password/i), 'wrong');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });
});

test('shows network error when server unreachable', async () => {
  axios.get.mockRejectedValue({ code: 'ECONNREFUSED', response: undefined });
  renderWithAuth(<LoginForm />);

  await userEvent.type(screen.getByLabelText(/username/i), 'admin');
  await userEvent.type(screen.getByLabelText(/password/i), 'admin');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText('Cannot reach server. Please check your connection.')).toBeInTheDocument();
  });
});

test('shows timeout error', async () => {
  axios.get.mockRejectedValue({ code: 'ECONNABORTED' });
  renderWithAuth(<LoginForm />);

  await userEvent.type(screen.getByLabelText(/username/i), 'admin');
  await userEvent.type(screen.getByLabelText(/password/i), 'admin');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText('Connection timed out. Server may be unreachable.')).toBeInTheDocument();
  });
});

test('sets loading state while verifying', async () => {
  let resolveRequest;
  axios.get.mockReturnValue(new Promise(resolve => { resolveRequest = resolve; }));
  renderWithAuth(<LoginForm />);

  await userEvent.type(screen.getByLabelText(/username/i), 'sa');
  await userEvent.type(screen.getByLabelText(/password/i), 'password');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(screen.getByRole('button', { name: /verifying/i })).toBeDisabled();

  resolveRequest({ data: [] });
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /login/i })).toBeEnabled();
  });
});
