export interface Project {
  id: string;
  title: string;
  description?: string;
  colorScheme: 'light' | 'dark';
  language: 'ru' | 'en';
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  order: number;
  steps: Step[];
}

export interface Step {
  id: string;
  content: string;
  images: Image[];
  status: 'pending' | 'completed';
  priority: 'normal' | 'important' | 'critical';
  notes?: string;
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
}

export type ViewMode = 'edit' | 'view';
