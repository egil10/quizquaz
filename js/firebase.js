// Firebase initialization and Firestore helper functions

// Initialize Firebase (imported from CDN in HTML)
let db = null;

function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded. Make sure to include Firebase scripts in HTML.');
        return false;
    }
    
    try {
        firebase.initializeApp(window.firebaseConfig);
        db = firebase.firestore();
        return true;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        return false;
    }
}

// Load quizzes from Firestore
async function loadQuizzesFromFirestore() {
    if (!db) {
        if (!initFirebase()) {
            throw new Error('Firebase not initialized');
        }
    }
    
    try {
        const snapshot = await db.collection('quizzes').orderBy('date', 'asc').get();
        const quizzes = [];
        
        snapshot.forEach(doc => {
            quizzes.push(doc.data());
        });
        
        return quizzes;
    } catch (error) {
        console.error('Error loading quizzes from Firestore:', error);
        throw error;
    }
}

// Save quiz to Firestore
async function saveQuizToFirestore(quiz) {
    if (!db) {
        if (!initFirebase()) {
            throw new Error('Firebase not initialized');
        }
    }
    
    try {
        // Use edition as document ID for easy updates
        await db.collection('quizzes').doc(`edition-${quiz.edition}`).set(quiz);
        return true;
    } catch (error) {
        console.error('Error saving quiz to Firestore:', error);
        throw error;
    }
}

// Delete quiz from Firestore
async function deleteQuizFromFirestore(edition) {
    if (!db) {
        if (!initFirebase()) {
            throw new Error('Firebase not initialized');
        }
    }
    
    try {
        await db.collection('quizzes').doc(`edition-${edition}`).delete();
        return true;
    } catch (error) {
        console.error('Error deleting quiz from Firestore:', error);
        throw error;
    }
}

// Check if Firebase is configured
function isFirebaseConfigured() {
    return window.firebaseConfig && 
           window.firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
           window.firebaseConfig.projectId !== 'YOUR_PROJECT_ID';
}

