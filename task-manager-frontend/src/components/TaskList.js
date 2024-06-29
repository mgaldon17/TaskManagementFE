import React, { useState } from 'react';
import axios from 'axios';
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
import config from "../security/apiConfig";
import { MenuItem, TableCell, TableRow } from '@mui/material';

const TaskList = ({ tasks, onTaskUpdated }) => {
    const [open, setOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState({
        id: '',
        name: '',
        done: false,
        created: '',
        priority: ''
    });

    const handleEdit = (task) => {
        setCurrentTask(task);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTask({ ...currentTask, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setCurrentTask({ ...currentTask, done: e.target.checked });
    };

    const handleUpdate = async () => {
        try {
            if (isNaN(Date.parse(currentTask.created))) {
                alert('Invalid date. Please enter a date in the format YYYY-MM-DD.');
                return;
            }
            const params = new URLSearchParams();
            params.append('name', currentTask.name);
            params.append('done', currentTask.done);
            params.append('created', currentTask.created);
            params.append('priority', currentTask.priority);

            await axios.put(`/tasks/${currentTask.id}`, params, config);
            await onTaskUpdated();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/tasks/${id}`, config);
            await onTaskUpdated();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };


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
                                <TableCell align="right">{task.priority}</TableCell>
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
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentTask.created}
                        onChange={handleChange}
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
                        <MenuItem value="LOW">Low</MenuItem>
                        <MenuItem value="NORMAL">Normal</MenuItem>
                        <MenuItem value="URGENT">Urgent</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        handleUpdate();
                        handleClose();
                    }} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default TaskList;