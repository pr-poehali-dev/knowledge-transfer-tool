import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types/project';
import { nanoid } from 'nanoid';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (project: Project) => void;
}

export const CreateProjectDialog = ({ open, onOpenChange, onCreate }: CreateProjectDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

  const handleCreate = () => {
    if (!title.trim()) return;

    const newProject: Project = {
      id: nanoid(),
      title: title.trim(),
      description: description.trim() || undefined,
      colorScheme,
      language,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onCreate(newProject);
    setTitle('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Новый проект</DialogTitle>
          <DialogDescription>
            Создайте структуру для пошаговых инструкций
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название проекта</Label>
            <Input
              id="title"
              placeholder="Инструкция по настройке оборудования"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание (опционально)</Label>
            <Textarea
              id="description"
              placeholder="Краткое описание инструкции"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Язык</Label>
              <Select value={language} onValueChange={(v: 'ru' | 'en') => setLanguage(v)}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Тема</Label>
              <Select value={colorScheme} onValueChange={(v: 'light' | 'dark') => setColorScheme(v)}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="dark">Тёмная</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Создать проект
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
