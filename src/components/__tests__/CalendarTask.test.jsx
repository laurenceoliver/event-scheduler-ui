import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import CalendarTask from '../CalendarTask';
import { TaskProvider, useTaskContext } from '../../context/TaskContext';

// Mock FullCalendar since it uses canvas/DOM APIs not available in jsdom
jest.mock('@fullcalendar/react', () => {
    return function MockFullCalendar({ events }) {
        return (
            <div data-testid="fullcalendar">
                {events.map((event) => (
                    <div key={event.id} data-testid={`event-${event.id}`}>
                        {event.title}
                    </div>
                ))}
            </div>
        );
    };
});

const mockTasks = [
    { id: 1, name: 'Task One', dueDate: '2026-04-01', statusId: 1, priority: 1, developerId: 1 },
    { id: 2, name: 'Task Two', dueDate: '2026-04-02', statusId: 2, priority: 2, developerId: 2 },
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

describe('CalendarTask', () => {
    it('renders nothing when no project is selected', () => {
        const { container } = render(
            <TaskProvider>
                <CalendarTask />
            </TaskProvider>
        );
        expect(container.querySelector('[data-testid="fullcalendar"]')).toBeNull();
    });

    it('renders calendar with task events', () => {
        render(
            <Wrapper>
                <CalendarTask />
            </Wrapper>
        );

        expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
        expect(screen.getByText('Task One')).toBeInTheDocument();
        expect(screen.getByText('Task Two')).toBeInTheDocument();
    });

    it('renders empty calendar when no tasks', () => {
        render(
            <Wrapper tasks={[]}>
                <CalendarTask />
            </Wrapper>
        );

        expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
        expect(screen.queryByTestId('event-1')).toBeNull();
    });
});
