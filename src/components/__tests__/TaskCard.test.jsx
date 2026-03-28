import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../TaskCard';
import { TaskProvider, useTaskContext } from '../../context/TaskContext';

const mockTasks = [
    { id: 1, name: 'Pending Task', statusId: 1, priority: 1, dueDate: '2026-04-01', developerId: 1 },
    { id: 2, name: 'In Progress Task', statusId: 2, priority: 2, dueDate: '2026-04-02', developerId: 2 },
    { id: 3, name: 'Completed Task', statusId: 3, priority: 3, dueDate: '2026-04-03', developerId: 1 },
];

const Wrapper = ({ children, project = 'proj-1', tasks = mockTasks }) => {
    const Initializer = ({ children: inner }) => {
        const { setSelectedProject, setTasks } = useTaskContext();
        useEffect(() => {
            setSelectedProject(project);
            setTasks(tasks);
        }, [setSelectedProject, setTasks]);
        return inner;
    };

    return (
        <TaskProvider>
            <Initializer>{children}</Initializer>
        </TaskProvider>
    );
};

describe('TaskCard', () => {
    it('renders nothing when no project is selected', () => {
        const { container } = render(
            <TaskProvider>
                <TaskCard />
            </TaskProvider>
        );
        expect(container.querySelector('.MuiGrid-container')).toBeNull();
    });

    it('renders three status columns', () => {
        render(
            <Wrapper>
                <TaskCard />
            </Wrapper>
        );

        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('renders tasks in correct columns', () => {
        render(
            <Wrapper>
                <TaskCard />
            </Wrapper>
        );

        expect(screen.getByText('Pending Task')).toBeInTheDocument();
        expect(screen.getByText('In Progress Task')).toBeInTheDocument();
        expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });

    it('opens task details dialog on task click', async () => {
        render(
            <Wrapper>
                <TaskCard />
            </Wrapper>
        );

        await userEvent.click(screen.getByText('Pending Task'));
        expect(screen.getByText('Priority: 1')).toBeInTheDocument();
    });
});
