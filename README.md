# Snaply - Social Media Reminder App

Snaply is a React Native mobile application that helps users schedule and manage their social media posts. The app allows users to create reminders for sharing content on platforms like Instagram and WhatsApp.

## Features

- Create reminders with photos and text
- Schedule posts for Instagram and WhatsApp
- Push notifications for reminder alerts
- Dark/Light theme support
- Cross-platform compatibility (iOS & Android)

## Tech Stack

- React Native
- Expo
- TypeScript
- AsyncStorage for local data persistence
- Expo Notifications for push notifications
- Expo Image Picker for photo selection
- Expo Intent Launcher for social media sharing

## Project Structure

```
snaply-new/
├── app/                    # Main application code
│   ├── _layout.tsx        # Root layout component
│   ├── index.tsx          # Home screen
│   ├── create-reminder.tsx # Create reminder screen
│   └── reminder/          # Reminder related screens
├── services/              # Business logic and services
│   ├── reminderService.ts # Reminder management
│   ├── photoService.ts    # Photo handling
│   ├── socialMediaService.ts # Social media integration
│   └── notificationService.ts # Push notifications
├── components/            # Reusable UI components
├── constants/             # App constants and theme
└── assets/               # Images and other static assets
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/UtkarshKarale/snaply-apk.git
```

2. Install dependencies:
```bash
cd snaply-new
npm install
```

3. Start the development server:
```bash
npx expo start
```

## Environment Setup

The app requires the following environment variables:
- `EXPO_PUBLIC_API_URL`: Backend API URL
- `EXPO_PUBLIC_APP_NAME`: Application name

## Building for Production

### Android APK
```bash
eas build -p android --profile preview
```

### iOS IPA
```bash
eas build -p ios --profile preview
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Utkarsh Karale - [@UtkarshKarale](https://github.com/UtkarshKarale)

Project Link: [https://github.com/UtkarshKarale/snaply-apk](https://github.com/UtkarshKarale/snaply-apk)

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
#   s n a p l y - a p k 
 
 