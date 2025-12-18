import { Project } from '@/types/project';

const STORAGE_KEY = 'methodio_projects';

export const storage = {
  getProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const projects = JSON.parse(data);
      return projects.map((p: Project) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  },

  saveProjects: (projects: Project[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  },

  getProject: (id: string): Project | null => {
    const projects = storage.getProjects();
    return projects.find(p => p.id === id) || null;
  },

  saveProject: (project: Project): void => {
    const projects = storage.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date() };
    } else {
      projects.push(project);
    }
    
    storage.saveProjects(projects);
  },

  deleteProject: (id: string): void => {
    const projects = storage.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    storage.saveProjects(filtered);
  },

  exportProjectToJSON: (project: Project): string => {
    return JSON.stringify(project, null, 2);
  },

  importProjectFromJSON: (json: string): Project | null => {
    try {
      const project = JSON.parse(json);
      return {
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      };
    } catch (error) {
      console.error('Error importing project:', error);
      return null;
    }
  },
};
