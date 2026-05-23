import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { taskService } from '../services/taskService';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { MenuItem, TableCell, TableRow } from '@mui/material';
import { PRIORITIES, PRIORITY_LABELS } from '../constants/priorities';

const INITIAL_TASK = {
    id: '',
    name: '',
    done: false,
    created: '',
    priority: ''
};

const TaskList = ({ tasks, onTaskUpdated }) => {
    const [open, setOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState({ ...INITIAL_TASK });
    const [updating, setUpdating] = useState(false);

    const handleEdit = (task) => {
        setCurrentTask({ ...task });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentTask({ ...INITIAL_TASK });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTask(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        setCurrentTask(prev => ({ ...prev, done: e.target.checked }));
    };

    const handleUpdate = async () => {
        if (currentTask.created && isNaN(Date.parse(currentTask.created))) {
            alert('Invalid date. Please enter a date in the format YYYY-MM-DD.');
            return false;
        }

        setUpdating(true);
        try {
            await taskService.updateTask(currentTask.id, {
                name: currentTask.name,
                done: currentTask.done,
                created: currentTask.created,
                priority: currentTask.priority,
            });
            await onTaskUpdated();
            return true;
        } catch (error) {
            console.error('Error updating task:', error);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await taskService.deleteTask(id);
            await onTaskUpdated();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    if (!tasks || tasks.length === 0) {
        return (
            <div>
                <h2>Task List</h2>
                <Typography variant="body1" color="text.secondary">
                    No tasks yet. Create one above.
                </Typography>
            </div>
        );
    }

    return (
        <div>
            <h2>Task List</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="task table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Done</TableCell>
                            <TableCell align="right">Created</TableCell>
                            <TableCell align="right">Priority</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell component="th" scope="row">{task.name}</TableCell>
                                <TableCell align="right">{task.done ? 'Yes' : 'No'}</TableCell>
                                <TableCell align="right">{task.created}</TableCell>
                                <TableCell align="right">{PRIORITY_LABELS[task.priority] || task.priority}</TableCell>
                                <TableCell align="right">
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEdit(task)}
                                            sx={{ marginRight: 2 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentTask.name}
                        onChange={handleChange}
                        inputProps={{ maxLength: 255 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={currentTask.done}
                                onChange={handleCheckboxChange}
                                name="done"
                                color="primary"
                            />
                        }
                        label="Done"
                    />
                    <TextField
                        margin="dense"
                        name="created"
                        label="Created"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={currentTask.created}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        margin="dense"
                        name="priority"
                        label="Priority"
                        select
                        fullWidth
                        variant="outlined"
                        value={currentTask.priority}
                        onChange={handleChange}
                    >
                        {PRIORITIES.map((p) => (
                            <MenuItem key={p} value={p}>{PRIORITY_LABELS[p]}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={updating}>
                        Cancel
                    </Button>
                    <Button onClick={async () => {
                        const success = await handleUpdate();
                        if (success) {
                            handleClose();
                        }
                    }} color="primary" disabled={updating}>
                        {updating ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

TaskList.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string,
        done: PropTypes.bool,
        created: PropTypes.string,
        priority: PropTypes.string,
    })),
    onTaskUpdated: PropTypes.func.isRequired,
};

export default TaskList;
