/**
 * Represents a reminder in the application
 */
export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  photoUri?: string;
  platforms: {
    instagram: boolean;
    whatsapp: boolean;
  };
  createdAt: string;
  updatedAt: string;
} 