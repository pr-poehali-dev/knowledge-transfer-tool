import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ImportHTMLDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportHTMLDialog = ({ open, onOpenChange }: ImportHTMLDialogProps) => {
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      toast.error('Пожалуйста, выберите HTML файл');
      return;
    }

    setImporting(true);

    try {
      const text = await file.text();
      
      const blob = new Blob([text], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      window.open(url, '_blank');
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      toast.success('HTML-приложение открыто в новой вкладке');
      onOpenChange(false);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Ошибка импорта HTML файла');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Импорт HTML-приложения</DialogTitle>
          <DialogDescription>
            Загрузите готовое HTML-приложение для просмотра
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Icon name="FileCode2" size={24} className="text-accent" />
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">Выберите HTML файл</p>
              <p className="text-sm text-muted-foreground">
                Приложение откроется в новой вкладке браузера
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button 
              onClick={handleButtonClick}
              disabled={importing}
              className="gap-2"
            >
              <Icon name="Upload" size={18} />
              {importing ? 'Загрузка...' : 'Выбрать HTML файл'}
            </Button>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-accent mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Что это делает?</p>
                <p>Загружает ваше готовое HTML-приложение и открывает его в новой вкладке браузера для просмотра и использования.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
