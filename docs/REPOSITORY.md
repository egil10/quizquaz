# QuizQuaz Repository Documentation

## Overview

QuizQuaz is a web-based quiz application that displays quiz editions in a newspaper-style format. The application allows users to browse through quiz editions, view questions and answers, and includes an admin interface for adding new quizzes.

**Live Site:** https://egil10.github.io/quizquaz/

## Project Structure

```
quizquaz/
├── index.html              # Main application page
├── admin.html              # Admin authentication and quiz form
├── assets/
│   └── favicon.svg         # Website favicon (black text on transparent)
├── data/
│   └── quizzes.json        # Quiz data (fallback if Firebase not configured)
├── docs/
│   ├── FIREBASE_SETUP.md  # Firebase setup instructions
│   └── REPOSITORY.md      # This file
├── js/
│   ├── app.js             # Main application logic
│   ├── admin.js           # Admin panel functionality
│   ├── firebase-config.js # Firebase configuration
│   └── firebase.js        # Firebase Firestore helper functions
├── styles/
│   ├── main.css           # Main application styles
│   └── admin.css          # Admin panel styles
└── README.md              # Project README
```

## Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling with CSS variables for theming
- **Vanilla JavaScript** - No frameworks, pure JS
- **Firebase Firestore** - Database for quiz storage
- **Lucide Icons** - SVG icon library
- **GitHub Pages** - Hosting

## Key Features

### User-Facing Features

1. **Newspaper-Style Layout**
   - Two-column display for questions and answers
   - Clean, readable typography using Georgia serif font
   - Compressed font sizes for efficient space usage

2. **Quiz Navigation**
   - Previous/Next buttons for sequential navigation
   - Sidebar with paginated editions list (8 per page)
   - Clickable edition items to jump to specific quizzes
   - Toggle button to show/hide sidebar

3. **Answer Visibility**
   - Answers hidden by default
   - "Show Answers" / "Hide Answers" button
   - Maintains consistent layout size when toggling

4. **Light/Dark Mode**
   - Theme toggle button in header
   - Persistent theme preference (localStorage)
   - Starry background animation in dark mode
   - Sun icon (black) for light mode, Moon icon (white) for dark mode

5. **Responsive Design**
   - Mobile-friendly layout
   - Sidebar collapses on smaller screens
   - Adaptive grid layouts

### Admin Features

1. **Authentication**
   - 16-character API key protection
   - Simple login screen
   - Session-based authentication

2. **Quiz Management**
   - Add new quizzes with 12 questions
   - Automatic draft saving every 30 seconds
   - Firebase integration for instant publishing
   - No GitHub commits needed

## File Descriptions

### `index.html`
Main application page. Contains:
- Header with title and theme toggle
- Main content area for quiz display
- Editions sidebar (right side)
- Footer with links

### `admin.html`
Admin interface page. Contains:
- Simple login screen (API key input)
- Full admin form (shown after authentication)
- Quiz entry form with 12 question/answer pairs

### `js/app.js`
Core application logic:
- `init()` - Initializes the app
- `loadQuizzes()` - Loads quizzes from Firebase or JSON fallback
- `updateUI()` - Updates the display with current quiz
- `renderQuiz()` - Renders quiz in newspaper format
- `toggleAnswers()` - Shows/hides answers
- `updateEditionsSidebar()` - Updates sidebar with pagination
- Theme management functions

### `js/admin.js`
Admin panel functionality:
- API key authentication
- Quiz form handling
- Firebase publishing (`saveQuizToFirestore`)
- Draft management (localStorage)
- Form validation

### `js/firebase-config.js`
Firebase configuration:
- Contains Firebase project credentials
- `isFirebaseConfigured()` - Checks if Firebase is set up

### `js/firebase.js`
Firebase Firestore helpers:
- `loadQuizzesFromFirestore()` - Loads all quizzes
- `saveQuizToFirestore()` - Saves a new quiz
- `deleteQuizFromFirestore()` - Deletes a quiz

### `styles/main.css`
Main application styles:
- CSS variables for theming
- Responsive design breakpoints
- Dark mode styles
- Button styles (white bg, black border, black text)
- Fixed sidebar height (600px)
- Consistent quiz container sizing

### `styles/admin.css`
Admin panel specific styles:
- Form layouts
- Button styles
- Success/error messages
- Info boxes

## Data Structure

### Quiz Object Format

```json
{
  "id": "edition-1",
  "date": "2024-01-01",
  "title": "January 1, 2024",
  "edition": 1,
  "questions": [
    {
      "number": 1,
      "question": "What is the capital of France?",
      "answer": "Paris"
    }
    // ... 11 more questions
  ]
}
```

### Firestore Structure

Quizzes are stored in Firestore as:
```
quizzes/
  edition-1/
    {quiz data}
  edition-2/
    {quiz data}
  ...
```

## Configuration

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Set security rules (see `docs/FIREBASE_SETUP.md`)
4. Get web app config
5. Add config to `js/firebase-config.js`

See `docs/FIREBASE_SETUP.md` for detailed instructions.

### Admin API Key

Default API key: `QUIZQUAZ2024API`

To change it:
1. Edit `js/admin.js` - Change `ADMIN_API_KEY` constant
2. Update the hash function if needed

## Adding Quizzes

### Via Admin Panel

1. Navigate to `admin.html`
2. Enter API key: `QUIZQUAZ2024API`
3. Fill out the form:
   - Date (auto-filled to today)
   - Title (e.g., "January 1, 2024")
   - Edition number
   - 12 questions and answers
4. Click "Publish to Firebase"
5. Quiz appears instantly on the site

### Direct JSON Editing

1. Edit `data/quizzes.json`
2. Add quiz object following the format above
3. Commit and push to GitHub
4. GitHub Pages will rebuild automatically

**Note:** Firebase takes precedence. If Firebase is configured, quizzes load from Firestore. JSON is only used as fallback.

## Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select branch (usually `main` or `gh-pages`)
4. Site is live at `https://[username].github.io/quizquaz/`

### Local Development

Run a local server:
```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

## Styling Details

### Color Scheme

**Light Mode:**
- Background: `#f5f5f0`
- Text: `#333`
- Cards: `#fff`
- Accent: `#333`

**Dark Mode:**
- Background: `#0a0a0a` (with stars)
- Text: `#e0e0e0`
- Cards: `#1a1a1a`
- Accent: `#e0e0e0`

### Typography

- Font Family: Georgia, serif
- Font sizes optimized for readability and space efficiency
- Uppercase headers with letter spacing

### Buttons

All buttons follow consistent styling:
- White background (`#fff`)
- Black border (2px solid `#000`)
- Black text (`#000`)
- Height: 40px
- Border radius: 6px
- Hover: Inverts to black bg, white text

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- CSS Grid and Flexbox required
- JavaScript ES6+ required

## Future Improvements

Potential enhancements:
- Search functionality
- Quiz categories/tags
- User favorites/bookmarks
- Print-friendly format
- Export to PDF
- Quiz statistics/analytics
- Comments/discussion features

## Troubleshooting

### Quizzes Not Loading

1. Check browser console for errors
2. Verify Firebase config in `js/firebase-config.js`
3. Check Firestore security rules
4. Verify `data/quizzes.json` exists and is valid JSON

### Admin Panel Not Working

1. Check API key is correct (16 characters)
2. Verify sessionStorage is enabled
3. Check browser console for JavaScript errors
4. Ensure Firebase is configured if publishing

### Styling Issues

1. Clear browser cache
2. Verify CSS files are loading
3. Check for CSS conflicts
4. Ensure CSS variables are supported

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

All rights reserved. QuizQuaz project.

## Contact

Repository: https://github.com/egil10/quizquaz
Live Site: https://egil10.github.io/quizquaz/

