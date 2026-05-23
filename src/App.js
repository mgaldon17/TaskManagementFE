import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import LoginForm from './components/LoginForm';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';
import { taskService } from './services/taskService';
import { Box, CircularProgress, Typography, Button } from '@mui/material';

function AuthenticatedApp() {
    const { logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await taskService.fetchTasks();
            const formattedTasks = data.map(task => {
                let formattedCreated = task.created;
                formattedCreated = (formattedCreated.includes("T") && formattedCreated.includes("Z"))
                    ? formattedCreated.replace("T", " ").replace("Z", "")
                    : formattedCreated;
                return { ...task, created: formattedCreated };
            });
            setTasks(formattedTasks);
        } catch (err) {
            setError(err.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (error) {
        return (
            <div className="App">
                <Typography variant="h6" color="error" mt={4}>
                    {error}
                </Typography>
            </div>
        );
    }

    return (
        <div className="App">
            <Box display="flex" justifyContent="flex-end" p={2}>
                <Button variant="outlined" onClick={logout} size="small">
                    Logout
                </Button>
            </Box>

            <ErrorBoundary>
                <TaskForm onTaskCreated={fetchTasks} />

                <Box mt={6}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
                    )}
                </Box>
            </ErrorBoundary>
        </div>
    );
}

function App() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    return <AuthenticatedApp />;
}

export default App;
