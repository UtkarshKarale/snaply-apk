import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Platform, Image, Switch, View, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { addReminder } from '@/services/reminderService';
import { useTheme } from '@/context/ThemeContext';
import { takePhoto, initializePhotoDirectory } from '@/services/photoService';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateReminderScreen() {
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => {
    // Set default time to 5 minutes from now
    const defaultDate = new Date();
    defaultDate.setMinutes(defaultDate.getMinutes() + 5);
    return defaultDate;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState({
    instagram: false,
    whatsapp: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(date);

  // Update tempDate when date changes
  useEffect(() => {
    setTempDate(date);
  }, [date]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const newDate = new Date(tempDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setTempDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const newDate = new Date(tempDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setTempDate(newDate);
    }
  };

  const handleSaveDateTime = () => {
    setDate(tempDate);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleCancelDateTime = () => {
    setTempDate(date);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleTakePhoto = async () => {
    try {
      await initializePhotoDirectory();
      const uri = await takePhoto();
      setPhotoUri(uri);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleCreateReminder = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your reminder');
      return;
    }

    if (!platforms.instagram && !platforms.whatsapp) {
      Alert.alert('Error', 'Please select at least one platform to share to');
      return;
    }

    try {
      setIsSubmitting(true);
      await addReminder({
        title: title.trim(),
        description: description.trim(),
        date: date.toISOString(),
        timestamp: date.getTime(),
        photoUri: photoUri || undefined,
        platforms,
      });
      
      Alert.alert('Success', 'Reminder created successfully');
      router.back();
    } catch (error) {
      console.error('Error creating reminder:', error);
      Alert.alert('Error', 'Failed to create reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.header}>Create New Reminder</ThemedText>
          
          <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText>Title</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: isDarkMode ? '#fff' : '#000'
                  }
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter reminder title"
                placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText>Description</ThemedText>
              <TextInput
                style={[
                  styles.input, 
                  styles.textArea,
                  { 
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: isDarkMode ? '#fff' : '#000'
                  }
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter reminder description"
                placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                multiline
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText>Date & Time</ThemedText>
              <ThemedView style={styles.dateTimeContainer}>
                <TouchableOpacity 
                  onPress={() => {
                    setTempDate(date);
                    setShowDatePicker(true);
                  }}
                  style={[
                    styles.dateTimeButton,
                    { backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }
                  ]}
                >
                  <Ionicons 
                    name="calendar-outline" 
                    size={20} 
                    color={isDarkMode ? '#fff' : '#000'} 
                    style={styles.dateTimeIcon}
                  />
                  <ThemedText>{formatDate(date)}</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => {
                    setTempDate(date);
                    setShowTimePicker(true);
                  }}
                  style={[
                    styles.dateTimeButton,
                    { backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }
                  ]}
                >
                  <Ionicons 
                    name="time-outline" 
                    size={20} 
                    color={isDarkMode ? '#fff' : '#000'} 
                    style={styles.dateTimeIcon}
                  />
                  <ThemedText>{formatTime(date)}</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText>Photo (Optional)</ThemedText>
              <TouchableOpacity 
                onPress={handleTakePhoto}
                style={[
                  styles.photoButton,
                  { backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }
                ]}
              >
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                ) : (
                  <ThemedView style={styles.photoPlaceholder}>
                    <Ionicons name="camera" size={24} color={isDarkMode ? '#fff' : '#000'} />
                    <ThemedText>Take Photo</ThemedText>
                  </ThemedView>
                )}
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText>Share to Platforms</ThemedText>
              <ThemedView style={styles.platformContainer}>
                <ThemedView style={styles.platformRow}>
                  <ThemedText>Instagram Story</ThemedText>
                  <Switch
                    value={platforms.instagram}
                    onValueChange={(value) => setPlatforms(prev => ({ ...prev, instagram: value }))}
                  />
                </ThemedView>
                <ThemedView style={styles.platformRow}>
                  <ThemedText>WhatsApp Status</ThemedText>
                  <Switch
                    value={platforms.whatsapp}
                    onValueChange={(value) => setPlatforms(prev => ({ ...prev, whatsapp: value }))}
                  />
                </ThemedView>
              </ThemedView>
            </ThemedView>

            <TouchableOpacity 
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleCreateReminder}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.buttonText}>
                {isSubmitting ? 'Creating...' : 'Create Reminder'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <Modal
        visible={showDatePicker || showTimePicker}
        transparent={true}
        animationType="slide"
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={[
            styles.modalContent,
            { backgroundColor: isDarkMode ? '#333' : '#fff' }
          ]}>
            <ThemedText style={styles.modalTitle}>
              {showDatePicker ? 'Select Date' : 'Select Time'}
            </ThemedText>
            
            {Platform.OS === 'ios' && (
              <View style={styles.pickerContainer}>
                {showDatePicker ? (
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                ) : (
                  <DateTimePicker
                    value={tempDate}
                    mode="time"
                    display="spinner"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
            )}

            {Platform.OS === 'android' && (
              <DateTimePicker
                value={tempDate}
                mode={showDatePicker ? "date" : "time"}
                display="default"
                onChange={showDatePicker ? handleDateChange : handleTimeChange}
                minimumDate={showDatePicker ? new Date() : undefined}
              />
            )}

            <ThemedView style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCancelDateTime}
              >
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveDateTime}
              >
                <ThemedText style={styles.modalButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  dateTimeIcon: {
    marginRight: 8,
  },
  photoButton: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  platformContainer: {
    gap: 12,
  },
  platformRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickerContainer: {
    width: '100%',
    height: 200,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 