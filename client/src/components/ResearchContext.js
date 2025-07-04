// Research Context.js
import { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const [projectId, setProjectId] = useState(null);
    const [newProject, setnewProject] = useState(false);

    return (
        <ProjectContext.Provider value={{ projectId, setProjectId, newProject, setnewProject }}>
        {children}
        </ProjectContext.Provider>
    );
};
