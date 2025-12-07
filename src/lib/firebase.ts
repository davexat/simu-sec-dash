import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration from environment variables
// For development, you can use placeholder values, but for production
// you must configure real Firebase credentials
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo"
};

// Initialize Firebase only once
let app: FirebaseApp;
let db: Firestore;

try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);

    // Log warning if using demo credentials
    if (firebaseConfig.apiKey === "demo-api-key") {
        console.warn(
            "⚠️ Firebase: Usando credenciales de demostración. " +
            "Configure las variables de entorno para producción. " +
            "Ver FIREBASE_SETUP.md para instrucciones."
        );
    }
} catch (error) {
    console.error("Error al inicializar Firebase:", error);
    throw error;
}

export { db, app };
