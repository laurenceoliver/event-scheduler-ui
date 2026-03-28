import {Box, Button, MenuItem, Select, TextField, Typography} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import {useEffect, useState} from "react";
import axios from "axios";
import {useTaskContext} from "../context/TaskContext";

const CreateTask = () => {
    const { selectedProject, developers, setDevelopers } = useTaskContext();

    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assignee, setAssignee] = useState('');
    const [priority, setPriority] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get('/api/developers')
            .then((response) => {
                setDevelopers(response.data); // expect array of projects
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects');
                setLoading(false);
            });
        // eslint-disable-next-line
    }, []);

    const handleCreate = async () => {
        if (!name || !priority || !dueDate || !assignee || !selectedProject) {
            alert('Please fill in all fields');
            return;
        }

        setCreating(true);

        try {
            await axios.post(`/api/tasks/${selectedProject}`, {
                name,
                priority,
                dueDate: dueDate.format('YYYY-MM-DD'),
                developerId: assignee,
                statusId: 1,
            });

            alert('Task created successfully');
            // Clear form
            setName('');
            setPriority('');
            setDueDate(null);
            setAssignee('');
        } catch (err) {
            console.error('Error creating task:', err);
            alert('Failed to create task');
        } finally {
            setCreating(false);
        }
    };

    return (
        selectedProject ?
        <div className="create-task-panel">
            <Typography variant="h6">
                Create Task
            </Typography>
            <Box display="flex" flexDirection="column" width="100%" gap={1}>
                <span>Name:</span>
                <TextField
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Box>
            <Box display="flex" flexDirection="column" width="100%" gap={1}>
                <span>Priority:</span>
                <Select
                    id="priority-select"
                    variant="outlined"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <MenuItem value="">-</MenuItem>
                    {[1, 2, 3, 4, 5].map((p) => (
                        <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                </Select>
            </Box>
            <Box display="flex" flexDirection="column" width="100%" gap={1}>
                <span>Due Date:</span>
                <DatePicker
                    value={dueDate}
                    onChange={(newValue) => setDueDate(newValue)}
                />
            </Box>
            <Box display="flex" flexDirection="column" width="100%" gap={1}>
                <span>Assignee:</span>
                <Select
                    id="assignee-select"
                    variant="outlined"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    disabled={loading || !!error}
                >
                    <MenuItem value="">-</MenuItem>
                    {developers?.map(({ developerId, developerName }) => (
                        <MenuItem key={developerId} value={developerId}>
                            {developerName}
                        </MenuItem>
                    ))}
                </Select>
                {error && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }}>{error}</span>
                )}
            </Box>

            <Button
                variant="contained"
                size="large"
                onClick={handleCreate}
                disabled={creating}
            >
                {creating ? 'Creating...' : 'Create'}
            </Button>
        </div> : null
    );
};

export default CreateTask;