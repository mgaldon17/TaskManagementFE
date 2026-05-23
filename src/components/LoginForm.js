import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password');
      } else if (err.code === 'ECONNABORTED') {
        setError('Connection timed out. Server may be unreachable.');
      } else if (!err.response) {
        setError('Cannot reach server. Please check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 4,
          border: '1px solid #ccc',
          borderRadius: 2,
          maxWidth: 400,
          width: '100%',
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Task Manager
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          autoFocus
          disabled={loading}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Verifying...' : 'Login'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
