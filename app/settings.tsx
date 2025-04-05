import { StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { theme, isDarkMode, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleThemeChange = async (value: boolean) => {
    try {
      setIsSubmitting(true);
      await setTheme(value ? 'dark' : 'light');
    } catch (error) {
      console.error('Error changing theme:', error);
      Alert.alert('Error', 'Failed to change theme. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Settings</ThemedText>
      
      <ThemedView style={styles.section}>
        <ThemedView style={styles.settingItem}>
          <ThemedText>Push Notifications</ThemedText>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            disabled={isSubmitting}
          />
        </ThemedView>

        <ThemedView style={styles.settingItem}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeChange}
            disabled={isSubmitting}
          />
        </ThemedView>
      </ThemedView>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.back()}
      >
        <ThemedText style={styles.buttonText}>Back to Home</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    gap: 16,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 