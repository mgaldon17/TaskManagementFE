import React, { useState } from 'react';
import axios from 'axios';
import config from "../security/apiConfig";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';


const TaskForm = ({ onTaskCreated }) => {
    const [name, setName] = useState('');
    const [done, setDone] = useState(false);
    const [created, setCreated] = useState('');
    const [priority, setPriority] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Construct URLSearchParams object with form data

            const params = new URLSearchParams();
            params.append('name', name);
            params.append('done', done);
            params.append('created', created);
            params.append('priority', priority);

            // Send POST request with URL-encoded data and Basic Auth header
            await axios.post('/tasks', params, config);

            // Call callback function to refresh task list after creation
            await onTaskCreated();

            // Reset form fields
            setName('');
            setDone(false);
            setCreated('');
            setPriority('');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                border: '1px solid #ccc',
                borderRadius: 2,
                maxWidth: 400,
                margin: '0 auto',
                mt: 4,
                boxShadow: 3
            }}
        >
            <h2>Create Task</h2>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={done}
                        onChange={(e) => setDone(e.target.checked)}
                        name="done"
                    />
                }
                label="Done"
            />
            <TextField
                label="Created"
                value={created}
                onChange={(e) => setCreated(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                select
                required
                fullWidth
            >
                <MenuItem value="">Select Priority</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="NORMAL">Normal</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" color="primary">
                Create Task
            </Button>
        </Box>
    );
};

export default TaskForm;