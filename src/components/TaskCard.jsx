import {useTaskContext} from "../context/TaskContext";
import {Card, CardActionArea, CardContent, Typography,} from "@mui/material";
import {useState} from "react";
import TaskDetailsDialog from "./TaskDetailsDialog";

const statusLabels = {
    1: "Pending",
    2: "In Progress",
    3: "Completed",
};

const TaskList = ({ status, tasks, onTaskClick }) => (
    <div className="col-12 col-md-4 mb-3 mb-md-0">
        <div className="d-flex flex-column gap-2">
            <Typography variant="h6">{statusLabels[status]}</Typography>
            {tasks
                .filter((task) => task.statusId === status)
                .map((task) => (
                    <Card key={task.id}>
                        <CardActionArea onClick={() => onTaskClick(task)}>
                            <CardContent>
                                <Typography variant="body2">{task.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
        </div>
    </div>
);

const TaskCard = () => {
    const { tasks, selectedProject } = useTaskContext();
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);

    const showTaskDetails = (task) => {
        setSelectedTask(task);
        setShowTaskModal(true);
    };

    const handleClose = () => {
        setShowTaskModal(false);
        setSelectedTask(null);
    };

    return (selectedProject ?
        <>
            <div className="row mt-4">
                {[1, 2, 3].map((status) => (
                    <TaskList key={status} status={status} tasks={tasks} onTaskClick={showTaskDetails} />
                ))}
            </div>

            <TaskDetailsDialog
                open={showTaskModal}
                onClose={handleClose}
                task={selectedTask}
            />
        </> : null
    );
};

export default TaskCard;
