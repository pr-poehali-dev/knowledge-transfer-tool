import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Step } from '@/types/project';

interface StepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: Step | null | undefined;
  onSave: (content: string, priority: Step['priority'], notes?: string) => void;
}

export const StepDialog = ({ open, onOpenChange, step, onSave }: StepDialogProps) => {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Step['priority']>('normal');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (step) {
      setContent(step.content);
      setPriority(step.priority);
      setNotes(step.notes || '');
    } else {
      setContent('');
      setPriority('normal');
      setNotes('');
    }
  }, [step, open]);

  const handleSave = () => {
    if (!content.trim()) return;
    onSave(content.trim(), priority, notes.trim() || undefined);
    setContent('');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{step ? 'Редактировать шаг' : 'Новый шаг'}</DialogTitle>
          <DialogDescription>
            Опишите действие, которое нужно выполнить
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="content">Описание шага</Label>
            <Textarea
              id="content"
              placeholder="Откройте крышку устройства и найдите разъём питания..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Приоритет</Label>
            <Select value={priority} onValueChange={(v: Step['priority']) => setPriority(v)}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--priority-normal))]" />
                    <span>Обычный</span>
                  </div>
                </SelectItem>
                <SelectItem value="important">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--priority-important))]" />
                    <span>Важный</span>
                  </div>
                </SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--priority-critical))]" />
                    <span>Критичный</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Заметки (опционально)</Label>
            <Textarea
              id="notes"
              placeholder="Дополнительная информация или предупреждения"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!content.trim()}>
            {step ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
