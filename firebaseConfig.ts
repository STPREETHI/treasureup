// FIX: Update to Firebase v8 compatible imports
// FIX: Use Firebase v9 compat imports to support v8 syntax with the v9 SDK.
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { firebaseConfig } from './firebaseCredentials';

// This check provides a clear, user-friendly error if the credentials are still placeholders.
// It stops the app from crashing with a generic Firebase error.
if (firebaseConfig.apiKey.startsWith("PASTE_YOUR")) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f9fafb;">
        <div style="background-color: #fff; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); text-align: center; border: 1px solid #fecaca; max-width: 600px;">
          <h1 style="font-size: 1.5rem; font-weight: bold; color: #b91c1c;">Firebase Configuration Error</h1>
          <p style="margin-top: 1rem; color: #374151;">The application is not connected to a database.</p>
          <p style="margin-top: 0.5rem; color: #374151;">Please follow the setup instructions and add your Firebase project credentials to the <code style="background-color: #fee2e2; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; color: #b91c1c;">firebaseCredentials.ts</code> file.</p>
        </div>
      </div>
    `;
  }
  // Stop further execution
  throw new Error("Firebase configuration is missing. Please edit firebaseCredentials.ts");
}

// FIX: Update to Firebase v8 initialization
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

export { db, auth };
