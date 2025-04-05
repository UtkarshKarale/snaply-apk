export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  timestamp: number;
  createdAt: string;
  completed: boolean;
  photoUri?: string;
  platforms: {
    instagram: boolean;
    whatsapp: boolean;
  };
} 