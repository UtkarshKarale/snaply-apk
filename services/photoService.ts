/**
 * Photo Service
 * 
 * This service handles all photo-related operations:
 * - Taking photos using the device camera
 * - Selecting photos from the device gallery
 * - Managing photo permissions
 * - Handling photo storage and cleanup
 * 
 * @module photoService
 */

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

/**
 * Interface for photo capture options
 */
interface PhotoOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

/**
 * Default options for photo capture
 */
const DEFAULT_OPTIONS: PhotoOptions = {
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
};

/**
 * Requests camera permissions from the user
 * 
 * @returns Promise<boolean> - True if permission was granted
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

/**
 * Requests photo library permissions from the user
 * 
 * @returns Promise<boolean> - True if permission was granted
 */
export const requestPhotoLibraryPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting photo library permission:', error);
    return false;
  }
};

/**
 * Takes a photo using the device camera
 * 
 * @param options - Optional photo capture settings
 * @returns Promise<string | undefined> - URI of the captured photo or undefined if capture failed
 */
export const takePhoto = async (options: PhotoOptions = DEFAULT_OPTIONS): Promise<string | undefined> => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      throw new Error('Camera permission not granted');
    }

    const result = await ImagePicker.launchCameraAsync({
      ...options,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) {
      return undefined;
    }

    return result.assets[0].uri;
  } catch (error) {
    console.error('Error taking photo:', error);
    return undefined;
  }
};

/**
 * Selects a photo from the device's photo library
 * 
 * @param options - Optional photo selection settings
 * @returns Promise<string | undefined> - URI of the selected photo or undefined if selection failed
 */
export const pickPhoto = async (options: PhotoOptions = DEFAULT_OPTIONS): Promise<string | undefined> => {
  try {
    const hasPermission = await requestPhotoLibraryPermission();
    if (!hasPermission) {
      throw new Error('Photo library permission not granted');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      ...options,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) {
      return undefined;
    }

    return result.assets[0].uri;
  } catch (error) {
    console.error('Error picking photo:', error);
    return undefined;
  }
};

/**
 * Deletes a photo from the device's file system
 * 
 * @param uri - URI of the photo to delete
 * @returns Promise<boolean> - True if deletion was successful
 */
export const deletePhoto = async (uri: string): Promise<boolean> => {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
};

/**
 * Copies a photo to the app's cache directory
 * 
 * @param uri - URI of the photo to copy
 * @returns Promise<string | undefined> - URI of the copied photo or undefined if copy failed
 */
export const copyPhotoToCache = async (uri: string): Promise<string | undefined> => {
  try {
    const filename = uri.split('/').pop();
    const destination = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.copyAsync({
      from: uri,
      to: destination,
    });
    return destination;
  } catch (error) {
    console.error('Error copying photo to cache:', error);
    return undefined;
  }
}; 