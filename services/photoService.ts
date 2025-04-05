import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const PHOTOS_DIRECTORY = `${FileSystem.documentDirectory}snaply_photos/`;

export const initializePhotoDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIRECTORY, { intermediates: true });
  }
};

export const requestCameraPermissions = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Camera permission is required to take photos');
  }
};

export const takePhoto = async (): Promise<string> => {
  await requestCameraPermissions();
  
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled) {
    throw new Error('Photo capture was cancelled');
  }

  const photo = result.assets[0];
  const fileName = `photo_${Date.now()}.jpg`;
  const destinationUri = `${PHOTOS_DIRECTORY}${fileName}`;

  await FileSystem.copyAsync({
    from: photo.uri,
    to: destinationUri
  });

  return destinationUri;
};

export const deletePhoto = async (photoUri: string) => {
  try {
    await FileSystem.deleteAsync(photoUri);
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
}; 