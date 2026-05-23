import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { taskService } from '../services/taskService';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import { PRIORITIES, PRIORITY_LABELS } from '../constants/priorities';

const TaskForm = ({ onTaskCreated }) => {
    const [name, setName] = useState('');
    const [done, setDone] = useState(false);
    const [created, setCreated] = useState('');
    const [priority, setPriority] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        if (created && isNaN(Date.parse(created))) {
            alert('Please enter a valid date format (e.g. YYYY-MM-DD).');
            return;
        }

        setSubmitting(true);
        try {
            await taskService.createTask({
                name,
                done,
                created,
                priority,
            });

            await onTaskCreated();

            setName('');
            setDone(false);
            setCreated('');
            setPriority('');
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setSubmitting(false);
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
                inputProps={{ maxLength: 255 }}
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
                type="date"
                value={created}
                onChange={(e) => setCreated(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
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
                {PRIORITIES.map((p) => (
                    <MenuItem key={p} value={p}>{PRIORITY_LABELS[p]}</MenuItem>
                ))}
            </TextField>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Task'}
            </Button>
        </Box>
    );
};

TaskForm.propTypes = {
    onTaskCreated: PropTypes.func.isRequired,
};

export default TaskForm;
