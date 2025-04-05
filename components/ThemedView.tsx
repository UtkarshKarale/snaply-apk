import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode 
    ? (darkColor || '#121212') 
    : (lightColor || '#FFFFFF');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
