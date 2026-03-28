import ProjectSelector from "../components/ProjectSelector";
import CreateTask from "../components/CreateTask";
import {Typography} from "@mui/material";
import CalendarTask from "../components/CalendarTask";
import TaskFilter from "../components/TaskFilter";
import TaskCard from "../components/TaskCard";

const ProjectManagement = () => {
    return (
        <div className="container-fluid px-2 px-md-3">
            <div className="row align-items-center mb-4">
                <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                    <Typography variant="h4">Project Management Tool</Typography>
                </div>
                <div className="col-12 col-sm-6">
                    <div className="d-flex align-items-center gap-2 justify-content-sm-end">
                        <Typography variant="h6">Project:</Typography>
                        <ProjectSelector />
                    </div>
                </div>
            </div>
            <div className="row g-4">
                <div className="col-12 col-lg-3">
                    <CreateTask />
                </div>
                <div className="col-12 col-lg-9">
                    <TaskFilter />
                    <TaskCard />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-12">
                    <CalendarTask />
                </div>
            </div>
        </div>
    );
};

export default ProjectManagement;
