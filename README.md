# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Demo video on Loom
   https://www.loom.com/share/7413ddd946a140d991fe43a9da1b49bc?sid=5186238b-00c9-4309-809a-0571af7123f3

## Get started

1. Install dependencies

   ```bash
   npm install
   ```
   Some dependencies may refuse to install. Use npx expo install package-name to select a version that works with your current Expo SDK version:

   ```bash
   npx expo install @react-navigation/material-top-tabs
   ```

   In case that fails. Add the --force flag to npm:

   ```bash
   npm install --force
   ```

2. Start the app(using development build) and choose the platform to view it: Options are Android, iOS simulator and web.

   ```bash
   npx expo start
   ```

   Or

   ```bash
   npx expo start -c  # -c clears the cache
   ```

   In the output, you'll find options to open the app in a

   - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

   Enter i to select iOS simulator

   This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Run on iOS device

1. First, generate native iOS directories using Prebuild

   ```bash
   npx expo prebuild
   ```

2. When you're ready, plugin your iPhone via USB to your laptop, and run:

   ```bash
   npx expo run:ios --device
   ```

   This command will compile the native iOS app locally, setup CocoaPos, create a build and a connection with your IOS device.

3. In case you run into iOS dependency issues run this command to reinstall the pos afresh

   ```bash
   pod install --repo-update
   ```

4. Diagnose issues with the app

   ```bash
   npx expo-doctor
   ```
   
## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
