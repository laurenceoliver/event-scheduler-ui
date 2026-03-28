import React, { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import TaskFilter from '../TaskFilter';
import { TaskProvider, useTaskContext } from '../../context/TaskContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

jest.mock('axios');

const Wrapper = ({ children, project = 'proj-1' }) => {
    const Initializer = ({ children: inner }) => {
        const { setSelectedProject } = useTaskContext();
        useEffect(() => {
            setSelectedProject(project);
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

describe('TaskFilter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axios.get.mockResolvedValue({ data: { content: [] } });
    });

    it('renders nothing when no project is selected', () => {
        const { container } = render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TaskProvider>
                    <TaskFilter />
                </TaskProvider>
            </LocalizationProvider>
        );
        expect(container.querySelector('.MuiGrid-container')).toBeNull();
    });

    it('renders filter controls when project is selected', async () => {
        render(
            <Wrapper>
                <TaskFilter />
            </Wrapper>
        );

        await waitFor(() => {
            expect(screen.getByText('Sort')).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
    });

    it('fetches tasks when project is selected', async () => {
        render(
            <Wrapper>
                <TaskFilter />
            </Wrapper>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                '/api/tasks/proj-1',
                expect.objectContaining({
                    params: expect.objectContaining({
                        sortBy: 'dueDate',
                    }),
                })
            );
        });
    });

    it('calls fetch again when Filter button is clicked', async () => {
        render(
            <Wrapper>
                <TaskFilter />
            </Wrapper>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
        });

        await userEvent.click(screen.getByRole('button', { name: 'Filter' }));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(2);
        });
    });
});
