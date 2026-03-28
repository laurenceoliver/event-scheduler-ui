import {Box, Button, Grid, MenuItem, Select, Typography} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateRangePicker} from "@mui/x-date-pickers-pro";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import axios from "axios";
import {useTaskContext} from "../context/TaskContext";

const TaskFilter = () => {
    const today = dayjs();
    const nextWeek = dayjs().add(7, "day");

    const { selectedProject, setTasks } = useTaskContext();

    const [dueDateRange, setDueDateRange] = useState([today, nextWeek]);
    const [sort, setSort] = useState('dueDate');
    const [loading, setLoading] = useState(false);

    const fetchTasks = () => {
        const [start, end] = dueDateRange;
        setLoading(true);
        axios.get(`/api/tasks/${selectedProject}`, {
            params: {
                startDate: start ? start?.format('YYYY-MM-DD') : null,
                endDate: end ? end?.format('YYYY-MM-DD') : null,
                sortBy: sort,
            }
        })
            .then((response) => {
                setTasks(response.data.content); // expect array of task
            })
            .catch((err) => {
                console.error('Error fetching tasks:', err);
                alert('Failed to load tasks');

            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (selectedProject) {
            fetchTasks();
        }
        // eslint-disable-next-line
    }, [selectedProject]);

    return (selectedProject ?
        <Grid container spacing={2} alignItems="center" justifyContent="space-evenly">
            <Grid item>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">
                        Due Date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                            value={dueDateRange}
                            onChange={(newValue) => setDueDateRange(newValue)}
                            sx={{ width: 300 }}
                        />
                    </LocalizationProvider>
                </Box>
            </Grid>
            <Grid item>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">
                        Sort
                    </Typography>
                    <Select
                        sx={{ width: 220 }}
                        id="sort-select"
                        variant="outlined"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <MenuItem value="dueDate">Due Date</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                    </Select>
                </Box>
            </Grid>
            <Grid item>
                <Button
                    disabled={loading}
                    variant="contained"
                    size="large"
                    onClick={() => fetchTasks()}
                >
                    Filter
                </Button>
            </Grid>
        </Grid> : null
    )
};

export default TaskFilter;