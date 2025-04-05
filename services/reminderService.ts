/**
 * Reminder Service
 * 
 * This service handles all reminder-related operations including:
 * - Creating new reminders
 * - Retrieving existing reminders
 * - Updating reminder details
 * - Deleting reminders
 * - Managing reminder notifications
 * - Sharing reminders to social media
 * 
 * @module reminderService
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { shareToInstagram, shareToWhatsApp } from './socialMediaService';
import { Reminder } from '../types/reminder';

const REMINDERS_STORAGE_KEY = 'snaply_reminders';

/**
 * Interface for reminder creation parameters
 */
interface CreateReminderParams {
  title: string;
  description: string;
  date: Date;
  photoUri?: string;
  platforms: {
    instagram: boolean;
    whatsapp: boolean;
  };
}

/**
 * Creates a new reminder and stores it in AsyncStorage
 * 
 * @param params - The reminder creation parameters
 * @returns Promise<Reminder> - The created reminder object
 * @throws Error if reminder creation fails
 */
export const createReminder = async (params: CreateReminderParams): Promise<Reminder> => {
  try {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: params.title,
      description: params.description,
      date: params.date.toISOString(),
      photoUri: params.photoUri,
      platforms: params.platforms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingReminders = await getReminders();
    const updatedReminders = [...existingReminders, newReminder];
    
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders));
    
    // Schedule notification for the reminder
    await scheduleReminderNotification(newReminder);
    
    return newReminder;
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw new Error('Failed to create reminder');
  }
};

/**
 * Retrieves all reminders from AsyncStorage
 * 
 * @returns Promise<Reminder[]> - Array of all reminders
 */
export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const remindersJson = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
    return remindersJson ? JSON.parse(remindersJson) : [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

/**
 * Updates an existing reminder
 * 
 * @param id - The ID of the reminder to update
 * @param updates - Partial reminder object with updates
 * @returns Promise<Reminder | null> - The updated reminder or null if not found
 */
export const updateReminder = async (id: string, updates: Partial<Reminder>): Promise<Reminder | null> => {
  try {
    const reminders = await getReminders();
    const index = reminders.findIndex(r => r.id === id);
    
    if (index === -1) return null;
    
    const updatedReminder = {
      ...reminders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    reminders[index] = updatedReminder;
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    
    // Update notification if date changed
    if (updates.date) {
      await scheduleReminderNotification(updatedReminder);
    }
    
    return updatedReminder;
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw new Error('Failed to update reminder');
  }
};

/**
 * Deletes a reminder by ID
 * 
 * @param id - The ID of the reminder to delete
 * @returns Promise<boolean> - True if deletion was successful
 */
export const deleteReminder = async (id: string): Promise<boolean> => {
  try {
    const reminders = await getReminders();
    const filteredReminders = reminders.filter(r => r.id !== id);
    
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(filteredReminders));
    
    // Cancel notification for the reminder
    await Notifications.cancelScheduledNotificationAsync(id);
    
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw new Error('Failed to delete reminder');
  }
};

/**
 * Schedules a notification for a reminder
 * 
 * @param reminder - The reminder to schedule notification for
 */
const scheduleReminderNotification = async (reminder: Reminder) => {
  try {
    // Cancel existing notification if any
    await Notifications.cancelScheduledNotificationAsync(reminder.id);
    
    // Schedule new notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.description,
        data: { reminderId: reminder.id },
      },
      trigger: new Date(reminder.date),
      identifier: reminder.id,
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

/**
 * Shares a reminder to specified social media platforms
 * 
 * @param reminder - The reminder to share
 * @returns Promise<boolean> - True if sharing was successful
 */
export const shareReminder = async (reminder: Reminder): Promise<boolean> => {
  try {
    const sharePromises: Promise<boolean>[] = [];
    
    if (reminder.platforms.instagram) {
      sharePromises.push(shareToInstagram(reminder.photoUri, reminder.title, reminder.description));
    }
    if (reminder.platforms.whatsapp) {
      sharePromises.push(shareToWhatsApp(reminder.photoUri, reminder.title, reminder.description));
    }

    const results = await Promise.all(sharePromises);
    return results.every((result: boolean) => result === true);
  } catch (error) {
    console.error('Error sharing reminder:', error);
    return false;
  }
};

/**
 * Checks for due reminders and triggers sharing
 * This function should be called periodically or when the app becomes active
 */
export const checkDueReminders = async () => {
  try {
    const reminders = await getReminders();
    const now = new Date();
    
    for (const reminder of reminders) {
      const reminderDate = new Date(reminder.date);
      if (reminderDate <= now) {
        await shareReminder(reminder);
        await deleteReminder(reminder.id);
      }
    }
  } catch (error) {
    console.error('Error checking due reminders:', error);
  }
}; 