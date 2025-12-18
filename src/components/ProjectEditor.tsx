import { useState } from 'react';
import { Project, Task, Step, ViewMode } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { TaskList } from './TaskList';
import { TaskDialog } from './TaskDialog';
import { StepDialog } from './StepDialog';
import { ExportDialog } from './ExportDialog';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

interface ProjectEditorProps {
  project: Project;
  onBack: () => void;
  onUpdate: (project: Project) => void;
}

export const ProjectEditor = ({ project, onBack, onUpdate }: ProjectEditorProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingStep, setEditingStep] = useState<{ taskId: string; step: Step } | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('');

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    const task = project.tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setTaskDialogOpen(true);
    }
  };

  const handleSaveTask = (title: string) => {
    let updatedTasks: Task[];

    if (editingTask) {
      updatedTasks = project.tasks.map((t) =>
        t.id === editingTask.id ? { ...t, title } : t
      );
    } else {
      const newTask: Task = {
        id: nanoid(),
        title,
        order: project.tasks.length,
        steps: [],
      };
      updatedTasks = [...project.tasks, newTask];
    }

    const updatedProject = { ...project, tasks: updatedTasks };
    onUpdate(updatedProject);
    storage.saveProject(updatedProject);
    toast.success(editingTask ? 'Задача обновлена' : 'Задача создана');
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = project.tasks.filter((t) => t.id !== taskId);
    const updatedProject = { ...project, tasks: updatedTasks };
    onUpdate(updatedProject);
    storage.saveProject(updatedProject);
    toast.success('Задача удалена');
  };

  const handleAddStep = (taskId: string) => {
    setActiveTaskId(taskId);
    setEditingStep(null);
    setStepDialogOpen(true);
  };

  const handleEditStep = (taskId: string, stepId: string) => {
    const task = project.tasks.find((t) => t.id === taskId);
    const step = task?.steps.find((s) => s.id === stepId);
    if (task && step) {
      setActiveTaskId(taskId);
      setEditingStep({ taskId, step });
      setStepDialogOpen(true);
    }
  };

  const handleSaveStep = (
    content: string,
    priority: Step['priority'],
    notes?: string
  ) => {
    const updatedTasks = project.tasks.map((task) => {
      if (task.id !== activeTaskId) return task;

      let updatedSteps: Step[];

      if (editingStep) {
        updatedSteps = task.steps.map((s) =>
          s.id === editingStep.step.id
            ? { ...s, content, priority, notes }
            : s
        );
      } else {
        const newStep: Step = {
          id: nanoid(),
          content,
          images: [],
          status: 'pending',
          priority,
          notes,
        };
        updatedSteps = [...task.steps, newStep];
      }

      return { ...task, steps: updatedSteps };
    });

    const updatedProject = { ...project, tasks: updatedTasks };
    onUpdate(updatedProject);
    storage.saveProject(updatedProject);
    toast.success(editingStep ? 'Шаг обновлён' : 'Шаг создан');
  };

  const handleDeleteStep = (taskId: string, stepId: string) => {
    const updatedTasks = project.tasks.map((task) => {
      if (task.id !== taskId) return task;
      return { ...task, steps: task.steps.filter((s) => s.id !== stepId) };
    });

    const updatedProject = { ...project, tasks: updatedTasks };
    onUpdate(updatedProject);
    storage.saveProject(updatedProject);
    toast.success('Шаг удалён');
  };

  const handleToggleStep = (taskId: string, stepId: string) => {
    const updatedTasks = project.tasks.map((task) => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        steps: task.steps.map((s) =>
          s.id === stepId
            ? { ...s, status: s.status === 'completed' ? 'pending' : 'completed' as const }
            : s
        ),
      };
    });

    const updatedProject = { ...project, tasks: updatedTasks };
    onUpdate(updatedProject);
    storage.saveProject(updatedProject);
  };

  const totalSteps = project.tasks.reduce((sum, task) => sum + task.steps.length, 0);
  const completedSteps = project.tasks.reduce(
    (sum, task) => sum + task.steps.filter((s) => s.status === 'completed').length,
    0
  );
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{project.title}</h1>
                {project.description && (
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
                <Icon name="Download" size={16} />
                Экспорт
              </Button>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList>
                  <TabsTrigger value="edit" className="gap-1">
                    <Icon name="Edit" size={16} />
                    Редактировать
                  </TabsTrigger>
                  <TabsTrigger value="view" className="gap-1">
                    <Icon name="Eye" size={16} />
                    Просмотр
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {project.tasks.length} задач • {totalSteps} шагов
              </span>
              <span className="font-medium">{progress}% выполнено</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <TaskList
          tasks={project.tasks}
          onAddTask={handleAddTask}
          onAddStep={handleAddStep}
          onToggleStep={handleToggleStep}
          onEditTask={handleEditTask}
          onEditStep={handleEditStep}
          onDeleteTask={handleDeleteTask}
          onDeleteStep={handleDeleteStep}
          viewMode={viewMode}
        />
      </main>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />

      <StepDialog
        open={stepDialogOpen}
        onOpenChange={setStepDialogOpen}
        step={editingStep?.step}
        onSave={handleSaveStep}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        project={project}
      />
    </div>
  );
};
