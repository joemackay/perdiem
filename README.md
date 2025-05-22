# Welcome to Time Scheduler 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Demo video on Loom
   [Demo Video](https://www.loom.com/share/7d65bfeec9a94071bc0e1012df842959?sid=2618c37e-ac4d-4185-9d2e-9c8e12e98cbc)


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

   - development build
   - Android emulator
   - iOS simulator
   - Expo Go

   Enter i to select iOS simulator

   This project uses [file-based routing](https://docs.expo.dev/router/introduction).

3. Run unit tests

   ```bash
   npm test
   ```  

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
 
## Limitations
1. The unit tests pass except for Google Authentication, and AsyncStorage
2. The Google Login and Push notifications only work on an actual iOS device

## Notes on my approach.
1. I opted to create simple date picker to demonstrate my skills
2. I included many tests in the unit tests to increase the test scope
3. I included a button to send push notifications to save you the waiting time
4. I used Zustand with AsyncStorage simply because they are faster and less boiler plate for a small app
5. I used Tailwind to enhance the look of the app - though it has colour limitations for iOS
6. I used a custom button, that I use in my other projects because it looks better has more room for props
7. Some code(like Button) is borrowed from my existing projects at the moment
8. I opted to avoid BottomSheet due to complications with iOS versions

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
