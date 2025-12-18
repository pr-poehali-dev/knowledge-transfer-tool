import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';
import { Project } from '@/types/project';
import { storage } from '@/lib/storage';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { ProjectEditor } from '@/components/ProjectEditor';
import { ImportHTMLDialog } from '@/components/ImportHTMLDialog';
import { toast } from 'sonner';

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importHTMLOpen, setImportHTMLOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const loaded = storage.getProjects();
    setProjects(loaded);
  };

  const handleCreateProject = (project: Project) => {
    storage.saveProject(project);
    loadProjects();
    toast.success('Проект создан');
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleUpdateProject = (project: Project) => {
    setSelectedProject(project);
    loadProjects();
  };

  const handleBackToHome = () => {
    setSelectedProject(null);
    loadProjects();
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      storage.deleteProject(projectToDelete);
      loadProjects();
      toast.success('Проект удалён');
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  if (selectedProject) {
    return (
      <ProjectEditor
        project={selectedProject}
        onBack={handleBackToHome}
        onUpdate={handleUpdateProject}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Methodio</h1>
              <p className="text-muted-foreground">Создавайте пошаговые инструкции</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setImportHTMLOpen(true)} 
                size="lg" 
                variant="outline"
                className="gap-2"
              >
                <Icon name="FileCode2" size={20} />
                Импорт HTML
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="gap-2">
                <Icon name="Plus" size={20} />
                Создать проект
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-secondary p-6 mb-6">
              <Icon name="FolderOpen" size={48} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Начните с первого проекта</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Создавайте структурированные инструкции с задачами, шагами и приоритетами.
              Экспортируйте в PDF или сохраняйте резервные копии в JSON.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="gap-2">
              <Icon name="Plus" size={20} />
              Создать первый проект
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => handleOpenProject(project)}
                onDelete={() => handleDeleteClick(project.id)}
              />
            ))}
          </div>
        )}
      </main>

      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateProject}
      />

      <ImportHTMLDialog
        open={importHTMLOpen}
        onOpenChange={setImportHTMLOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Проект и все его данные будут удалены безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}