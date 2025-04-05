import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { requestNotificationPermissions, setupNotificationListeners } from '@/services/notificationService';

export default function RootLayout() {
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await requestNotificationPermissions();
        const cleanup = setupNotificationListeners();
        return cleanup;
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="create-reminder" 
          options={{ 
            presentation: 'modal',
            title: 'Create Reminder',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
            animation: 'slide_from_right'
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
