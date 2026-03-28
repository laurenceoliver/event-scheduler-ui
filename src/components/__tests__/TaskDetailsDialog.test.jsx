import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskDetailsDialog from '../TaskDetailsDialog';
import { TaskProvider } from '../../context/TaskContext';

const mockDevelopers = [
    { developerId: 1, developerName: 'Alice' },
    { developerId: 2, developerName: 'Bob' },
];

const mockTask = {
    id: 1,
    name: 'Fix login bug',
    priority: 3,
    developerId: 1,
    dueDate: '2026-04-01',
    statusId: 2,
};

const MockTaskContext = ({ children }) => (
    <TaskProvider>{children}</TaskProvider>
);

// We need to set developers in context, so use a custom wrapper
const renderWithDevelopers = (ui) => {
    const Wrapper = ({ children }) => {
        const { useEffect } = require('react');
        const { useTaskContext } = require('../../context/TaskContext');

        const Inner = () => {
            const { setDevelopers } = useTaskContext();
            useEffect(() => {
                setDevelopers(mockDevelopers);
            }, [setDevelopers]);
            return children;
        };

        return (
            <TaskProvider>
                <Inner />
            </TaskProvider>
        );
    };

    return render(ui, { wrapper: Wrapper });
};

describe('TaskDetailsDialog', () => {
    it('renders nothing when task is null', () => {
        const { container } = render(
            <MockTaskContext>
                <TaskDetailsDialog open={true} onClose={jest.fn()} task={null} />
            </MockTaskContext>
        );
        expect(container.innerHTML).toBe('');
    });

    it('renders task details when open', () => {
        renderWithDevelopers(
            <TaskDetailsDialog open={true} onClose={jest.fn()} task={mockTask} />
        );

        expect(screen.getByText('Fix login bug')).toBeInTheDocument();
        expect(screen.getByText('Priority: 3')).toBeInTheDocument();
        expect(screen.getByText('Assignee: Alice')).toBeInTheDocument();
        expect(screen.getByText('Status: In Progress')).toBeInTheDocument();
        expect(screen.getByText('Due Date: 1 April 2026')).toBeInTheDocument();
    });

    it('calls onClose when Close button is clicked', async () => {
        const onClose = jest.fn();
        renderWithDevelopers(
            <TaskDetailsDialog open={true} onClose={onClose} task={mockTask} />
        );

        await userEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalled();
    });
});
