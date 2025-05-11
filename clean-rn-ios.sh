#!/bin/bash

echo "Cleaning React Native iOS project..."

# Stop Metro bundler
echo "Killing any running Metro bundler..."
kill $(lsof -ti:8081) 2>/dev/null || true

# Clean watchman
echo "Clearing watchman..."
watchman watch-del-all

# Remove node_modules, Pods, build caches
echo "Removing node_modules, Pods, and caches..."
rm -rf node_modules ios/Pods ios/Podfile.lock ios/build

# Reinstall node dependencies
echo "Reinstalling npm packages..."
npm install

# Reinstall CocoaPods (using arch for Apple Silicon)
echo "Installing iOS Pods..."
cd ios
arch -x86_64 pod install --repo-update
cd ..

# Reset Metro bundler cache
echo "Resetting Metro bundler cache..."
npx react-native start --reset-cache &

echo "Done! Now run: npx react-native run-ios"

