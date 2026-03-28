import React, {useEffect, useState} from "react";
import {CircularProgress, FormControl, MenuItem, Select} from "@mui/material";
import axios from "axios";
import {useTaskContext} from "../context/TaskContext";

const ProjectSelector = () => {
    const { selectedProject, setSelectedProject } = useTaskContext();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setSelectedProject(event.target.value);
    };

    useEffect(() => {
        setLoading(true);
        axios.get('/api/projects')
            .then((response) => {
                setProjects(response.data); // expect array of projects
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects');
                setLoading(false);
            });
    }, []);

    return (
        <FormControl sx={{ width: { xs: '100%', sm: 300 } }}>
            <Select
                id="project-select"
                value={selectedProject}
                onChange={handleChange}
                disabled={loading || !!error}
                variant="outlined"
            >
                <MenuItem value="">
                    {loading ?
                        <>
                            <CircularProgress size={20} />
                            &nbsp; Loading...
                        </>
                        : <em>Please select a project</em>
                    }
                </MenuItem>
                {error && (
                    <MenuItem value="">
                        {error}
                    </MenuItem>
                )}
                {!loading && !error && projects.map((proj) => (
                    <MenuItem key={proj.projectId} value={proj.projectId}>
                        {proj.projectName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ProjectSelector;
