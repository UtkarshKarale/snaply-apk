import { StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { getReminders, updateReminder, deleteReminder } from '@/services/reminderService';
import { Reminder } from '@/types/reminder';
import { useTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const { isDarkMode } = useTheme();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const loadedReminders = await getReminders();
      // Sort by date (most recent first)
      const sortedReminders = loadedReminders.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setReminders(sortedReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
      Alert.alert('Error', 'Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleCreateReminder = () => {
    router.push({
      pathname: '/create-reminder',
      params: { presentation: 'modal' }
    });
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleToggleComplete = async (reminder: Reminder) => {
    try {
      const updatedReminder = {
        ...reminder,
        completed: !reminder.completed
      };
      await updateReminder(updatedReminder);
      loadReminders(); // Reload the list
    } catch (error) {
      console.error('Error updating reminder:', error);
      Alert.alert('Error', 'Failed to update reminder');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReminder(id);
              loadReminders(); // Reload the list
            } catch (error) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Error', 'Failed to delete reminder');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Snaply</ThemedText>
        <ThemedText type="subtitle">Your Social Media Reminder Assistant</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Upcoming Reminders</ThemedText>
        
        {loading ? (
          <ThemedText>Loading reminders...</ThemedText>
        ) : reminders.length === 0 ? (
          <ThemedView style={styles.reminderCard}>
            <ThemedText>No upcoming reminders</ThemedText>
            <TouchableOpacity style={styles.addButton} onPress={handleCreateReminder}>
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          </ThemedView>
        ) : (
          reminders.map(reminder => (
            <ThemedView key={reminder.id} style={styles.reminderCard}>
              <ThemedView style={styles.reminderContent}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => handleToggleComplete(reminder)}
                >
                  <Ionicons 
                    name={reminder.completed ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={reminder.completed ? "#4CAF50" : "#666"} 
                  />
                </TouchableOpacity>
                <ThemedView style={styles.reminderDetails}>
                  <ThemedText style={[
                    styles.reminderTitle,
                    reminder.completed && styles.completedText
                  ]}>
                    {reminder.title}
                  </ThemedText>
                  <ThemedText style={styles.reminderDate}>
                    {formatDate(reminder.date)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteReminder(reminder.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </ThemedView>
          ))
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Quick Actions</ThemedText>
        <ThemedView style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCreateReminder}>
            <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            <ThemedText>New Reminder</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenSettings}>
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
            <ThemedText>Settings</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  section: {
    padding: 20,
    gap: 12,
  },
  reminderCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    marginRight: 12,
  },
  reminderDetails: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  reminderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    minWidth: 120,
  },
});
