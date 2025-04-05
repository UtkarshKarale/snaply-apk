import * as FileSystem from 'expo-file-system';
import { Platform, Linking } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';

// Check if Instagram is installed
const isInstagramInstalled = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      return await Linking.canOpenURL('instagram://');
    } else {
      // On Android, we'll try to open Instagram directly
      return await Linking.canOpenURL('instagram://');
    }
  } catch (error) {
    console.error('Error checking Instagram installation:', error);
    return false;
  }
};

// Check if WhatsApp is installed
const isWhatsAppInstalled = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      return await Linking.canOpenURL('whatsapp://');
    } else {
      // On Android, we'll try to open WhatsApp directly
      return await Linking.canOpenURL('whatsapp://');
    }
  } catch (error) {
    console.error('Error checking WhatsApp installation:', error);
    return false;
  }
};

// Share to Instagram
export const shareToInstagram = async (photoUri: string | undefined, title: string, description: string): Promise<boolean> => {
  try {
    const instagramInstalled = await isInstagramInstalled();
    
    if (!instagramInstalled) {
      console.warn('Instagram is not installed on this device');
      return false;
    }
    
    if (Platform.OS === 'ios') {
      if (photoUri) {
        // For iOS, we need to use the Instagram URL scheme
        const instagramUrl = `instagram://library?AssetPath=${encodeURIComponent(photoUri)}`;
        const canOpen = await Linking.canOpenURL(instagramUrl);
        
        if (canOpen) {
          await Linking.openURL(instagramUrl);
          return true;
        } else {
          // Fallback to sharing
          await Sharing.shareAsync(photoUri, {
            UTI: 'public.jpeg',
            mimeType: 'image/jpeg',
          });
          return true;
        }
      } else {
        // Text-only sharing on iOS
        await Sharing.shareAsync(`${title}\n\n${description}`, {
          mimeType: 'text/plain',
        });
        return true;
      }
    } else {
      // Android implementation
      if (photoUri) {
        // Try to open Instagram directly
        try {
          const instagramUrl = `instagram://library?AssetPath=${encodeURIComponent(photoUri)}`;
          await Linking.openURL(instagramUrl);
          return true;
        } catch (error) {
          console.warn('Failed to open Instagram directly, falling back to share sheet:', error);
          // Fallback to share sheet
          await IntentLauncher.startActivityAsync('android.intent.action.SEND', {
            type: 'image/jpeg',
            extra: {
              'android.intent.extra.STREAM': photoUri,
              'android.intent.extra.TEXT': `${title}\n\n${description}`,
            },
          });
          return true;
        }
      } else {
        // Text-only sharing on Android
        await IntentLauncher.startActivityAsync('android.intent.action.SEND', {
          type: 'text/plain',
          extra: {
            'android.intent.extra.TEXT': `${title}\n\n${description}`,
          },
        });
        return true;
      }
    }
  } catch (error) {
    console.error('Error sharing to Instagram:', error);
    return false;
  }
};

// Share to WhatsApp
export const shareToWhatsApp = async (photoUri: string | undefined, title: string, description: string): Promise<boolean> => {
  try {
    const whatsappInstalled = await isWhatsAppInstalled();
    
    if (!whatsappInstalled) {
      console.warn('WhatsApp is not installed on this device');
      return false;
    }
    
    if (Platform.OS === 'ios') {
      if (photoUri) {
        // For iOS, we need to use the WhatsApp URL scheme
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(`${title}\n\n${description}`)}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
          return true;
        } else {
          // Fallback to sharing
          await Sharing.shareAsync(photoUri, {
            UTI: 'public.jpeg',
            mimeType: 'image/jpeg',
          });
          return true;
        }
      } else {
        // Text-only sharing on iOS
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(`${title}\n\n${description}`)}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
          return true;
        } else {
          // Fallback to sharing
          await Sharing.shareAsync(`${title}\n\n${description}`, {
            mimeType: 'text/plain',
          });
          return true;
        }
      }
    } else {
      // Android implementation
      if (photoUri) {
        // Try to open WhatsApp directly
        try {
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(`${title}\n\n${description}`)}`;
          await Linking.openURL(whatsappUrl);
          return true;
        } catch (error) {
          console.warn('Failed to open WhatsApp directly, falling back to share sheet:', error);
          // Fallback to share sheet
          await IntentLauncher.startActivityAsync('android.intent.action.SEND', {
            type: 'image/jpeg',
            extra: {
              'android.intent.extra.STREAM': photoUri,
              'android.intent.extra.TEXT': `${title}\n\n${description}`,
            },
          });
          return true;
        }
      } else {
        // Text-only sharing on Android
        try {
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(`${title}\n\n${description}`)}`;
          await Linking.openURL(whatsappUrl);
          return true;
        } catch (error) {
          console.warn('Failed to open WhatsApp directly, falling back to share sheet:', error);
          // Fallback to share sheet
          await IntentLauncher.startActivityAsync('android.intent.action.SEND', {
            type: 'text/plain',
            extra: {
              'android.intent.extra.TEXT': `${title}\n\n${description}`,
            },
          });
          return true;
        }
      }
    }
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
    return false;
  }
}; 