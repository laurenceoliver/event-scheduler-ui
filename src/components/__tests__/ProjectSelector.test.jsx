import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ProjectSelector from '../ProjectSelector';
import { TaskProvider } from '../../context/TaskContext';

jest.mock('axios');

const renderWithContext = (ui) =>
    render(<TaskProvider>{ui}</TaskProvider>);

const mockProjects = [
    { projectId: 1, projectName: 'Project Alpha' },
    { projectId: 2, projectName: 'Project Beta' },
];

describe('ProjectSelector', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders a select element', () => {
        axios.get.mockReturnValue(new Promise(() => {}));
        renderWithContext(<ProjectSelector />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders project options after successful fetch', async () => {
        axios.get.mockResolvedValue({ data: mockProjects });
        renderWithContext(<ProjectSelector />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-disabled', 'true');
        });

        await userEvent.click(screen.getByRole('combobox'));
        expect(screen.getByText('Project Alpha')).toBeInTheDocument();
        expect(screen.getByText('Project Beta')).toBeInTheDocument();
    });

    it('disables select on fetch failure', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));
        renderWithContext(<ProjectSelector />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
        });
    });

    it('calls the API with correct URL', () => {
        axios.get.mockResolvedValue({ data: [] });
        renderWithContext(<ProjectSelector />);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/projects');
    });
});
