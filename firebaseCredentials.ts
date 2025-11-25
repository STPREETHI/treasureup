// ====================================================================================
// IMPORTANT: PASTE YOUR FIREBASE CONFIGURATION HERE
// ====================================================================================
// 1. Go to your Firebase project console.
// 2. Click the gear icon ⚙️ > Project settings.
// 3. In the "General" tab, scroll down to "Your apps".
// 4. Click on your web app, then select "Config" to find this object.
// 5. Copy the entire object and paste it here, replacing the placeholder values.
// ====================================================================================

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};
