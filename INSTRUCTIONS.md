# Society Treasurer Manager: Setup & Deployment Guide

Follow these steps to connect the application to a live Firebase database and deploy it to the web.

## Part 1: Setting Up Your Firebase Project

Firebase will act as your backend, storing your data and managing user logins.

### 1. Create a Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and give your project a name (e.g., "Society-Treasurer-App").
3.  Continue through the steps. You can disable Google Analytics for this project if you wish.
4.  Once your project is ready, you'll be taken to the project dashboard.

### 2. Set Up Firestore Database
This is where your transactions and residents will be stored.
1.  From the left-hand menu, go to **Build > Firestore Database**.
2.  Click **"Create database"**.
3.  Select **"Start in production mode"** and click **"Next"**.
4.  Choose a Cloud Firestore location (choose one close to you). Click **"Enable"**.
5.  Go to the **Rules** tab and paste the following rules. These rules ensure that only logged-in users can read or write data.
    ```json
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```
6.  Click **"Publish"**.

### 3. Set Up Firebase Authentication
This will handle user logins.
1.  From the left-hand menu, go to **Build > Authentication**.
2.  Click **"Get started"**.
3.  Under the **"Sign-in method"** tab, select **"Email/Password"** and enable it. Click **"Save"**.
4.  Go to the **"Users"** tab and click **"Add user"**. Create your two users here:
    *   **User 1 (Treasurer):**
        *   Email: `treasurer@society.app` (or any email you prefer)
        *   Password: A secure password of your choice
    *   **User 2 (Secretary):**
        *   Email: `secretary@society.app` (or any email you prefer)
        *   Password: A secure password of your choice

### 4. Get Your Firebase Configuration
1.  Go back to your Project Overview by clicking the gear icon ⚙️ next to "Project Overview" and selecting **"Project settings"**.
2.  In the "General" tab, scroll down to "Your apps".
3.  Click the web icon `</>`.
4.  Give the app a nickname (e.g., "Treasurer Web App") and click **"Register app"**.
5.  Firebase will show you a configuration object. It looks like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "...",
      appId: "..."
    };
    ```
6.  **Copy this entire object.** You will need it in the next part.

## Part 2: Connecting the React App

Now, you'll connect the React code to your new Firebase backend.

### 1. Edit the Configuration File
1.  In your code editor, open the file named `firebaseCredentials.ts`.
2.  You will see a placeholder `firebaseConfig` object.
3.  **Replace the entire placeholder object with the one you copied from your Firebase project settings.**
4.  Save the file. Your application is now connected to your Firebase backend.

## Part 3: Deploying to the Web with Vercel

Vercel is a platform that makes deploying web applications incredibly easy.

### 1. Push Your Code to GitHub
1.  Create a new repository on [GitHub](https://github.com).
2.  Follow the instructions on GitHub to push your local project code (including your updated `firebaseCredentials.ts` file) to the new repository.

### 2. Deploy with Vercel
1.  Sign up for a free account at [Vercel](https://vercel.com) using your GitHub account.
2.  On your Vercel dashboard, click **"Add New... > Project"**.
3.  Select the GitHub repository you just created and click **"Import"**.
4.  Vercel will automatically detect that it's a Vite project (or similar static site). You don't need to change any settings.
5.  **You do not need to add Environment Variables on Vercel**, because your credentials are now part of your code in `firebaseCredentials.ts`.
6.  Click **"Deploy"**.

Vercel will now build and deploy your application. In a minute or two, it will provide you with a public URL (e.g., `https://your-app-name.vercel.app`) where your live Society Treasurer Manager is running!

You can now log in using the user credentials you created in the Firebase console and start managing your society's finances.
