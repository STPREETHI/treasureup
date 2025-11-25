🌟 TreasureUp — Personal Expense & Budget Manager

A smart, simple, and modern expense tracking web app built using React + Vite + Firebase.
TreasureUp helps users track spending, set budgets, analyze expenses, and understand financial habits effortlessly.

🚀 Live Demo

👉 https://treasuryapp-4d288.web.app

✨ Features
🔐 Authentication

Email + Password login

Firebase Authentication

Secure, user-isolated data

💰 Expense Management

Add, edit, delete expenses

Categorization (Food, Travel, Bills, Shopping, etc.)

Automatic timestamps

📊 Dashboard

Total monthly spending overview

Category-wise charts

Clean & minimal UI

🎯 Budgeting

Set monthly budgets

Track amount spent vs remaining

Alerts for overspending

☁️ Cloud Sync (Firestore)

Real-time database updates

User-specific documents

No backend server needed

📱 Responsive

Works on all screen sizes

Mobile-friendly design

🛠️ Tech Stack
Technology	Purpose
React + Vite	Fast UI development
Firebase Auth	Secure login
Firebase Firestore	Real-time DB
Firebase Hosting	Deployment
CSS / Tailwind (optional)	Styling
📂 Project Structure
treasureup/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── firebase/        # firebaseConfig.js
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── dist/                # Production build
├── firebase.json
├── .firebaserc
├── .gitignore
└── README.md


🔥 Firebase Setup

Create a .env file (DO NOT push to GitHub):

VITE_API_KEY=yourKey
VITE_AUTH_DOMAIN=yourDomain
VITE_PROJECT_ID=yourID
VITE_STORAGE_BUCKET=yourBucket
VITE_MESSAGING_SENDER_ID=yourSenderID
VITE_APP_ID=yourAppID
VITE_MEASUREMENT_ID=yourMeasureID


Modify your firebaseConfig.js:

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

🧪 Running Locally
npm install
npm run dev


App runs at:
👉 http://localhost:5173

🚀 Deployment (Firebase Hosting)
npm run build
firebase deploy


Your live site will appear at:

https://treasuryapp-4d288.web.app

🤝 Contributing

Feel free to fork the repo and submit improvements!

📜 License

Licensed under the MIT License.
