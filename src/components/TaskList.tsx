import { Task, Step } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface TaskListProps {
  tasks: Task[];
  onAddTask: () => void;
  onAddStep: (taskId: string) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
  onEditTask: (taskId: string) => void;
  onEditStep: (taskId: string, stepId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteStep: (taskId: string, stepId: string) => void;
  viewMode: 'edit' | 'view';
}

export const TaskList = ({
  tasks,
  onAddTask,
  onAddStep,
  onToggleStep,
  onEditTask,
  onEditStep,
  onDeleteTask,
  onDeleteStep,
  viewMode,
}: TaskListProps) => {
  const getPriorityColor = (priority: Step['priority']) => {
    switch (priority) {
      case 'normal':
        return 'hsl(var(--priority-normal))';
      case 'important':
        return 'hsl(var(--priority-important))';
      case 'critical':
        return 'hsl(var(--priority-critical))';
    }
  };

  const getPriorityLabel = (priority: Step['priority']) => {
    switch (priority) {
      case 'normal':
        return 'Обычный';
      case 'important':
        return 'Важный';
      case 'critical':
        return 'Критичный';
    }
  };

  if (tasks.length === 0 && viewMode === 'edit') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-secondary p-4 mb-4">
          <Icon name="ListTodo" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Начните с создания задачи</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Разбейте инструкцию на логические задачи, каждая из которых будет содержать шаги
        </p>
        <Button onClick={onAddTask}>
          <Icon name="Plus" size={18} />
          Создать первую задачу
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              {viewMode === 'edit' && (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEditTask(task.id)}>
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)}>
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {task.steps.length === 0 ? (
              viewMode === 'edit' && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">Шагов пока нет</p>
                  <Button size="sm" variant="outline" onClick={() => onAddStep(task.id)}>
                    <Icon name="Plus" size={16} />
                    Добавить шаг
                  </Button>
                </div>
              )
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {task.steps.map((step, index) => (
                  <AccordionItem key={step.id} value={step.id} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={step.status === 'completed'}
                          onCheckedChange={() => onToggleStep(task.id, step.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div
                          className="w-1 h-8 rounded-full"
                          style={{ backgroundColor: getPriorityColor(step.priority) }}
                        />
                        <span className="font-medium">Шаг {index + 1}</span>
                        <Badge
                          variant="outline"
                          className="ml-auto"
                          style={{ borderColor: getPriorityColor(step.priority) }}
                        >
                          {getPriorityLabel(step.priority)}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-foreground">{step.content}</p>
                        </div>

                        {step.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {step.images.map((image) => (
                              <img
                                key={image.id}
                                src={image.url}
                                alt={image.alt || ''}
                                className="w-full h-32 object-cover rounded-md border"
                              />
                            ))}
                          </div>
                        )}

                        {step.notes && (
                          <div className="bg-secondary/50 p-3 rounded-md text-sm">
                            <p className="text-muted-foreground">{step.notes}</p>
                          </div>
                        )}

                        {viewMode === 'edit' && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEditStep(task.id, step.id)}
                            >
                              <Icon name="Edit" size={14} />
                              Изменить
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDeleteStep(task.id, step.id)}
                            >
                              <Icon name="Trash2" size={14} />
                              Удалить
                            </Button>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {viewMode === 'edit' && task.steps.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddStep(task.id)}
                className="w-full mt-3"
              >
                <Icon name="Plus" size={16} />
                Добавить шаг
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {viewMode === 'edit' && tasks.length > 0 && (
        <Button onClick={onAddTask} variant="outline" className="w-full">
          <Icon name="Plus" size={18} />
          Добавить задачу
        </Button>
      )}
    </div>
  );
};
