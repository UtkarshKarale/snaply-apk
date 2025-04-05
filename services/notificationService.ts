import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Reminder } from '@/types/reminder';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return finalStatus;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    throw error;
  }
};

// Schedule a notification for a reminder
export const scheduleReminderNotification = async (reminder: Reminder) => {
  try {
    const triggerTime = new Date(reminder.timestamp);
    
    // Schedule notification 5 minutes before the reminder time
    triggerTime.setMinutes(triggerTime.getMinutes() - 5);
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder: ' + reminder.title,
        body: reminder.description,
        data: { reminderId: reminder.id },
      },
      trigger: {
        type: 'date',
        date: triggerTime,
      },
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
};

// Cancel a scheduled notification
export const cancelReminderNotification = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
    throw error;
  }
};

// Handle notification response
export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  const reminderId = response.notification.request.content.data?.reminderId;
  if (reminderId) {
    // Handle notification tap - you can navigate to the reminder details or mark it as completed
    console.log('Notification tapped for reminder:', reminderId);
  }
};

// Set up notification listeners
export const setupNotificationListeners = () => {
  // Handle notifications received while app is foregrounded
  const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received in foreground:', notification);
  });

  // Handle notification response (when user taps notification)
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

  // Return cleanup function
  return () => {
    foregroundSubscription.remove();
    responseSubscription.remove();
  };
}; 