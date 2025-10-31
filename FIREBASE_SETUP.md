# Firebase Setup Guide

## Why Firebase?

✅ **No GitHub commits needed** - Quizzes publish instantly!  
✅ **Works from anywhere** - Phone, tablet, desktop  
✅ **Free tier** - More than enough for weekly quizzes  
✅ **Instant updates** - No waiting for GitHub Pages to rebuild  

## Setup Steps (5 minutes)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Name it (e.g., "quizquaz")
   - Continue through setup

2. **Enable Firestore Database**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create database"
   - **Choose "Start in test mode"** (we'll update rules after)
   - Choose a location (closest to you/your users)
   - Click "Enable"

3. **Update Security Rules** (Do this immediately after creating!)
   - In Firebase Console, go to Firestore Database > **Rules** tab
   - Click "Edit rules"
   - Replace the default test mode rules with these:
   
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /quizzes/{quiz} {
         // Allow anyone to read quizzes (public website)
         allow read: if true;
         
         // Allow writes temporarily (protected by API key in app code)
         // UPDATE: Change the date below to extend write access
         allow write: if request.time < timestamp.date(2025, 12, 31);
       }
     }
   }
   ```
   
   - Click "Publish"
   - **Important:** The API key check in your admin page provides basic protection. For production, you should add Firebase Authentication later.

4. **Get Web App Config**
   - Go to Project Settings (gear icon ⚙️)
   - Scroll to "Your apps" section
   - Click the Web icon (`</>`)
   - Register app (name it "QuizQuaz Web")
   - Copy the config values (you'll see something like this):

5. **Add Config to Your Site**
   - Open `js/firebase-config.js` in your project
   - Replace ALL the placeholder values with your actual Firebase config:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...your-actual-key",
     authDomain: "quizquaz-xxxxx.firebaseapp.com",
     projectId: "quizquaz-xxxxx",
     storageBucket: "quizquaz-xxxxx.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```
   
   - Save the file

6. **Done!**
   - Refresh your admin page
   - It should detect Firebase is configured
   - Start adding quizzes!

## Firestore Structure

Your quizzes will be stored like this:
```
quizzes/
  edition-1/
    {quiz data}
  edition-2/
    {quiz data}
  ...
```

## Security Notes

**Current Setup:**
- ✅ Public read access (anyone can view quizzes)
- ✅ Write protection via API key (only you can add quizzes)
- ⚠️ For production, consider adding Firebase Authentication for better security

**Security Rules Explained:**
- `allow read: if true` - Anyone can read quizzes (needed for your public website)
- `allow write: if request.time < timestamp.date(2025, 12, 31)` - Allows writes until the date specified (update this date to extend access)

**Important Security Note:**
- The API key check in your admin page (`js/admin.js`) provides basic protection
- However, anyone who knows your API key could potentially write to Firestore
- For better security, consider:
  1. Keep your API key secret (don't share it)
  2. Update the date in rules before it expires
  3. Consider adding Firebase Authentication later for production use

If you already have quizzes in `data/quizzes.json`, you can:
1. Use the admin page to re-add them (they'll go to Firebase)
2. Or write a migration script (I can help with this)

## Benefits

- **Instant publishing** - No GitHub commits needed
- **Mobile-friendly** - Add quizzes from your phone in minutes
- **Backup** - Firebase keeps your data safe
- **Scalable** - Can handle thousands of quizzes

That's it! Much simpler than GitHub commits! 🎉

