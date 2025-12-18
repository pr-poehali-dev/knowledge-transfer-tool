import { Project } from '@/types/project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ project, onOpen, onDelete }: ProjectCardProps) => {
  const totalSteps = project.tasks.reduce((sum, task) => sum + task.steps.length, 0);
  const completedSteps = project.tasks.reduce(
    (sum, task) => sum + task.steps.filter(s => s.status === 'completed').length,
    0
  );
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-scale-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold mb-1">{project.title}</CardTitle>
            {project.description && (
              <CardDescription className="text-sm">{project.description}</CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Icon name="Trash2" size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="ListTodo" size={16} />
              <span>{project.tasks.length} задач</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="CheckSquare" size={16} />
              <span>{totalSteps} шагов</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Прогресс</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {project.language === 'ru' ? 'Русский' : 'English'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {project.colorScheme === 'light' ? 'Светлая' : 'Тёмная'}
              </Badge>
            </div>
            <Button onClick={onOpen} size="sm" className="gap-1">
              <span>Открыть</span>
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground pt-1">
            {format(project.updatedAt, 'd MMMM yyyy', { locale: ru })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
