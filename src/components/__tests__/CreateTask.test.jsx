import React, { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import CreateTask from '../CreateTask';
import { TaskProvider, useTaskContext } from '../../context/TaskContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

jest.mock('axios');

const mockDevelopers = [
    { developerId: 1, developerName: 'Alice' },
    { developerId: 2, developerName: 'Bob' },
];

const Wrapper = ({ children }) => {
    const Initializer = ({ children: inner }) => {
        const { setSelectedProject } = useTaskContext();
        useEffect(() => {
            setSelectedProject('proj-1');
        }, [setSelectedProject]);
        return inner;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TaskProvider>
                <Initializer>{children}</Initializer>
            </TaskProvider>
        </LocalizationProvider>
    );
};

describe('CreateTask', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axios.get.mockResolvedValue({ data: mockDevelopers });
    });

    it('renders nothing when no project is selected', () => {
        const { container } = render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TaskProvider>
                    <CreateTask />
                </TaskProvider>
            </LocalizationProvider>
        );
        expect(container.querySelector('.create-task-panel')).toBeNull();
    });

    it('renders the form when a project is selected', async () => {
        render(
            <Wrapper>
                <CreateTask />
            </Wrapper>
        );

        await waitFor(() => {
            expect(screen.getByText('Create Task')).toBeInTheDocument();
        });

        expect(screen.getByText('Name:')).toBeInTheDocument();
        expect(screen.getByText('Priority:')).toBeInTheDocument();
        expect(screen.getByText('Due Date:')).toBeInTheDocument();
        expect(screen.getByText('Assignee:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });

    it('fetches developers on mount', async () => {
        render(
            <Wrapper>
                <CreateTask />
            </Wrapper>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/api/developers');
        });
    });

    it('shows alert when submitting with empty fields', async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(
            <Wrapper>
                <CreateTask />
            </Wrapper>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('button', { name: 'Create' }));
        expect(window.alert).toHaveBeenCalledWith('Please fill in all fields');
    });
});
