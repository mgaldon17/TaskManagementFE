import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import axios from 'axios';
import config from "./security/apiConfig";
import { Box } from '@mui/system';

function App() {
    const [tasks, setTasks] = useState([]);
    const fetchTasks = async () => {
        try {
            const response = await axios.get('/tasks', config);
            console.log(response.data); // Log the response data
            const formattedTasks = response.data.map(task => {
                // Format the 'created' date
                let formattedCreated = task.created;
                formattedCreated = (formattedCreated.includes("T") && formattedCreated.includes("Z"))
                    ? formattedCreated.replace("T", " ").replace("Z", "")
                    : formattedCreated;

                return { ...task, created: formattedCreated };
            });
            setTasks(formattedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks().then(r => console.log('Tasks fetched'));
    }, []);

    return (
        <div className="App">

            <TaskForm onTaskCreated={fetchTasks} />

            <Box mt={6}>
                <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
            </Box>

        </div>
    );
}

export default App;