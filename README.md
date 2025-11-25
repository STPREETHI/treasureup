🌟 TreasureUp — Personal Expense & Budget Manager

A smart, simple, and modern expense tracking web app built using React + Vite + Firebase.
TreasureUp helps users track their spending, set budgets, analyze expenses, and manage their financial habits with ease.

🚀 Live Demo: Add your Firebase Hosting URL here

✨ Features
🔐 Authentication

Email + Password login

Firebase Authentication

Secure user-based data isolation

💰 Expense Management

Add, edit, delete expenses

Categorize expenses (Food, Travel, Bills, Shopping, etc.)

Auto-timestamping of entries

📊 Dashboard

Total monthly spending

Category-wise breakdown

Clean, minimal UI for easy insights

🎯 Budgeting

Set monthly budgets

Track how much you’ve spent vs. remaining

Visual warnings when overspending

☁️ Cloud Sync (Firebase Firestore)

Realtime updates

User-specific documents

No backend server required

📱 Responsive Design

Works on desktop, tablet, and mobile

Clean, modern, card-based UI

🛠️ Tech Stack
Technology	Purpose
React + Vite	UI + Fast development
Firebase Auth	Secure login
Firebase Firestore	Real-time database
Firebase Hosting	Deployment
CSS / Tailwind (if used)	Styling
📂 Project Structure
treasureup/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── firebase/    # firebaseConfig.js
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── dist/            # Production build
├── firebase.json
├── .firebaserc
├── .gitignore
└── README.md

🔥 Firebase Setup

Create a .env file (not uploaded to GitHub):

VITE_API_KEY=yourKey
VITE_AUTH_DOMAIN=yourDomain
VITE_PROJECT_ID=yourProjectID
VITE_STORAGE_BUCKET=yourBucket
VITE_MESSAGING_SENDER_ID=yourSenderID
VITE_APP_ID=yourAppID
VITE_MEASUREMENT_ID=yourMeasureID


And in your firebaseConfig.js:

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

🚀 Deployment (Firebase Hosting)
npm run build
firebase deploy


Your site will be available at:

https://your-project.web.app

🤝 Contributing

Contributions are welcome!
Feel free to fork, improve, and make pull requests.

📜 License

This project is licensed under the MIT License.

❤️ About

TreasureUp is built with love to simplify personal finance and help users get better at managing money in a clean, intuitive way.
