import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Project } from '@/types/project';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export const ExportDialog = ({ open, onOpenChange, project }: ExportDialogProps) => {
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = () => {
    try {
      const json = storage.exportProjectToJSON(project);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.title.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('JSON файл загружен');
    } catch (error) {
      toast.error('Ошибка экспорта JSON');
      console.error(error);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Разрешите всплывающие окна для экспорта');
        return;
      }

      const html = generatePrintHTML(project);
      printWindow.document.write(html);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setExporting(false);
          toast.success('Откройте диалог печати и выберите "Сохранить как PDF"');
        }, 500);
      };
    } catch (error) {
      toast.error('Ошибка экспорта PDF');
      console.error(error);
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Экспорт проекта</DialogTitle>
          <DialogDescription>
            Сохраните инструкцию для печати или резервного копирования
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pdf" className="py-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Экспорт в PDF</h4>
              <p className="text-sm text-muted-foreground">
                Создайте готовую к печати версию инструкции со всеми задачами и шагами
              </p>
            </div>
            <Button onClick={handleExportPDF} disabled={exporting} className="w-full">
              <Icon name="FileDown" size={18} />
              {exporting ? 'Подготовка...' : 'Скачать PDF'}
            </Button>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Экспорт в JSON</h4>
              <p className="text-sm text-muted-foreground">
                Сохраните проект в формате JSON для резервного копирования или переноса
              </p>
            </div>
            <Button onClick={handleExportJSON} variant="outline" className="w-full">
              <Icon name="FileJson" size={18} />
              Скачать JSON
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

function generatePrintHTML(project: Project): string {
  const totalSteps = project.tasks.reduce((sum, task) => sum + task.steps.length, 0);
  const completedSteps = project.tasks.reduce(
    (sum, task) => sum + task.steps.filter((s) => s.status === 'completed').length,
    0
  );
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const priorityColors = {
    normal: '#0EA5E9',
    important: '#F97316',
    critical: '#8B5CF6',
  };

  const priorityLabels = {
    normal: 'Обычный',
    important: 'Важный',
    critical: 'Критичный',
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${project.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'IBM Plex Sans', sans-serif;
            line-height: 1.6;
            color: #1a1f2c;
            padding: 40px;
            max-width: 210mm;
            margin: 0 auto;
          }
          
          .header {
            border-bottom: 3px solid #0EA5E9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .description {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 16px;
          }
          
          .meta {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: #6b7280;
            margin-top: 12px;
          }
          
          .progress {
            margin-top: 12px;
            background: #f3f4f6;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
          }
          
          .progress-bar {
            background: #0EA5E9;
            height: 100%;
            width: ${progress}%;
          }
          
          .task {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          
          .task-title {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #1a1f2c;
          }
          
          .step {
            margin-bottom: 20px;
            padding: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            page-break-inside: avoid;
          }
          
          .step-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }
          
          .step-number {
            font-weight: 600;
            color: #1a1f2c;
          }
          
          .priority-indicator {
            width: 4px;
            height: 24px;
            border-radius: 2px;
          }
          
          .priority-badge {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            margin-left: auto;
          }
          
          .step-content {
            color: #374151;
            margin-bottom: 8px;
          }
          
          .step-notes {
            background: #f9fafb;
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
            color: #6b7280;
            margin-top: 12px;
          }
          
          .checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid #d1d5db;
            border-radius: 4px;
            flex-shrink: 0;
          }
          
          .checkbox.checked {
            background: #0EA5E9;
            border-color: #0EA5E9;
            position: relative;
          }
          
          .checkbox.checked::after {
            content: '✓';
            position: absolute;
            color: white;
            font-size: 14px;
            font-weight: 700;
            top: -2px;
            left: 2px;
          }
          
          @media print {
            body {
              padding: 20px;
            }
            
            .task {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${project.title}</h1>
          ${project.description ? `<p class="description">${project.description}</p>` : ''}
          <div class="meta">
            <span>${project.tasks.length} задач</span>
            <span>${totalSteps} шагов</span>
            <span>${progress}% выполнено</span>
          </div>
          <div class="progress">
            <div class="progress-bar"></div>
          </div>
        </div>
        
        ${project.tasks
          .map(
            (task, taskIndex) => `
          <div class="task">
            <h2 class="task-title">${taskIndex + 1}. ${task.title}</h2>
            ${task.steps
              .map(
                (step, stepIndex) => `
              <div class="step">
                <div class="step-header">
                  <div class="checkbox ${step.status === 'completed' ? 'checked' : ''}"></div>
                  <div class="priority-indicator" style="background-color: ${
                    priorityColors[step.priority]
                  }"></div>
                  <span class="step-number">Шаг ${stepIndex + 1}</span>
                  <span class="priority-badge" style="background-color: ${
                    priorityColors[step.priority]
                  }20; color: ${priorityColors[step.priority]}">${priorityLabels[step.priority]}</span>
                </div>
                <div class="step-content">${step.content}</div>
                ${step.notes ? `<div class="step-notes">${step.notes}</div>` : ''}
              </div>
            `
              )
              .join('')}
          </div>
        `
          )
          .join('')}
      </body>
    </html>
  `;
}
