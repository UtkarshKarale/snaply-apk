import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '@/types/reminder';
import { shareToInstagram, shareToWhatsApp } from './socialMediaService';
import { scheduleReminderNotification, cancelReminderNotification } from './notificationService';

const REMINDERS_STORAGE_KEY = 'snaply_reminders';
const NOTIFICATION_IDS_KEY = 'snaply_notification_ids';

// Get all reminders
export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const remindersJson = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
    return remindersJson ? JSON.parse(remindersJson) : [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

// Get notification IDs mapping
const getNotificationIds = async (): Promise<Record<string, string>> => {
  try {
    const idsJson = await AsyncStorage.getItem(NOTIFICATION_IDS_KEY);
    return idsJson ? JSON.parse(idsJson) : {};
  } catch (error) {
    console.error('Error getting notification IDs:', error);
    return {};
  }
};

// Save notification IDs mapping
const saveNotificationIds = async (ids: Record<string, string>): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving notification IDs:', error);
    throw error;
  }
};

// Add a new reminder
export const addReminder = async (reminder: Omit<Reminder, 'id' | 'createdAt' | 'completed'>): Promise<Reminder> => {
  try {
    const reminders = await getReminders();
    
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    
    // Schedule notification for the reminder
    const notificationId = await scheduleReminderNotification(newReminder);
    
    // Save notification ID mapping
    const notificationIds = await getNotificationIds();
    notificationIds[newReminder.id] = notificationId;
    await saveNotificationIds(notificationIds);
    
    const updatedReminders = [...reminders, newReminder];
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders));
    
    return newReminder;
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};

// Update a reminder
export const updateReminder = async (updatedReminder: Reminder): Promise<Reminder> => {
  try {
    const reminders = await getReminders();
    const oldReminder = reminders.find(r => r.id === updatedReminder.id);
    
    const updatedReminders = reminders.map(reminder => 
      reminder.id === updatedReminder.id ? updatedReminder : reminder
    );
    
    // Update notification if reminder time changed
    if (oldReminder && oldReminder.timestamp !== updatedReminder.timestamp) {
      const notificationIds = await getNotificationIds();
      const oldNotificationId = notificationIds[updatedReminder.id];
      
      if (oldNotificationId) {
        await cancelReminderNotification(oldNotificationId);
      }
      
      const newNotificationId = await scheduleReminderNotification(updatedReminder);
      notificationIds[updatedReminder.id] = newNotificationId;
      await saveNotificationIds(notificationIds);
    }
    
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders));
    return updatedReminder;
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

// Delete a reminder
export const deleteReminder = async (id: string): Promise<void> => {
  try {
    const reminders = await getReminders();
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    
    // Cancel notification for the deleted reminder
    const notificationIds = await getNotificationIds();
    const notificationId = notificationIds[id];
    
    if (notificationId) {
      await cancelReminderNotification(notificationId);
      delete notificationIds[id];
      await saveNotificationIds(notificationIds);
    }
    
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders));
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

// Share reminder to social media
export const shareReminder = async (reminder: Reminder): Promise<void> => {
  try {
    if (reminder.platforms.instagram) {
      await shareToInstagram(reminder.photoUri, reminder.title, reminder.description);
    }
    if (reminder.platforms.whatsapp) {
      await shareToWhatsApp(reminder.photoUri, reminder.title, reminder.description);
    }
    
    // Mark reminder as completed after sharing
    const updatedReminder = {
      ...reminder,
      completed: true
    };
    await updateReminder(updatedReminder);
  } catch (error) {
    console.error('Error sharing reminder:', error);
    throw error;
  }
};

// Check for due reminders and share them
export const checkAndShareDueReminders = async (): Promise<void> => {
  try {
    const reminders = await getReminders();
    const now = new Date().getTime();
    
    for (const reminder of reminders) {
      if (!reminder.completed && reminder.timestamp <= now) {
        await shareReminder(reminder);
      }
    }
  } catch (error) {
    console.error('Error checking due reminders:', error);
    throw error;
  }
}; 