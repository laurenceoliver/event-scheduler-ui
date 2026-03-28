import React, {useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import {useTaskContext} from "../context/TaskContext";
import TaskDetailsDialog from "./TaskDetailsDialog";
import {Global} from "@emotion/react";

const globalStyles = (
    <Global
        styles={{
            '.fc a': {
                color: 'inherit',
                textDecoration: 'none',
            },
            '.fc-event': {
                cursor: 'pointer',
            },
        }}
    />
);

const CalendarTask = () => {
    const { tasks, selectedProject } = useTaskContext();

    const [selectedTask, setSelectedTask] = useState({});
    const [showTaskModal, setShowTaskModal] = useState(false);

    const handleEventClick = (clickInfo) => {
        const taskId = clickInfo.event.id;
        const task = tasks.find((t) => String(t.id) === String(taskId));
        if (task) {
            setSelectedTask(task);
            setShowTaskModal(true);
        }
    };

    const handleClose = () => {
        setShowTaskModal(false);
        setSelectedTask(null);
    };

    return (selectedProject ?
        <>
            {globalStyles}
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
                displayEventTime={false}
                eventClick={handleEventClick}
                events={
                    tasks.map(task => ({
                        id: String(task.id),
                        title: task?.name,
                        date: task?.dueDate,
                    }))
                }
            />

            <TaskDetailsDialog
                open={showTaskModal}
                onClose={handleClose}
                task={selectedTask}
            />
        </> : null
    );
};

export default CalendarTask;