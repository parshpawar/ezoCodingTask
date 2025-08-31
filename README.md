# React Native Firebase Auth Example

This project shows how to use Firebase Authentication (Email/Password) in a React Native CLI app.  
It includes Login, Signup, and a User List screen that fetches data from the RandomUser API.

## Features
- Firebase Email/Password login and signup
- Validation for email and password
- Loader shown during login, signup, and logout
- User list displayed with name, age, phone, email, location, and picture
- Pull-to-refresh on list
- Optimized FlatList for large data
- Logout confirmation modal

## Step 1: Clone the repo


```bash
git clone https://github.com/parshpawar/ezoCodingTask.git
cd ezoCodingTask
```

## Step 2: Install dependencies


### For Android

```bash
npm install
```

## Step 3: Setup Firebase

Create a project in Firebase Console

Enable Email/Password authentication

Download google-services.json (Android) → put in android/app/

Download GoogleService-Info.plist (iOS) → put in ios/

## Step 4: Android extra setup:

In android/build.gradle add
```bash
classpath 'com.google.gms:google-services:4.3.15'
```
In android/app/build.gradle add
```bash
apply plugin: 'com.google.gms.google-services'
```

## Step 5: For iOS
```bash
cd ios && pod install
```

## Step 6: Run the app

For Android:
```bash
npx react-native run-android
```
For iOS:
```bash
npx react-native run-ios
```



