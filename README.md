# QuizQuaz

**Live Site:** [https://egil10.github.io/quizquaz/](https://egil10.github.io/quizquaz/)

A modern quiz publication platform with edition-based navigation. Display quizzes in a clean, newspaper-style format with numbered questions and answers—perfect for daily or weekly quiz challenges.

## Features

- **Edition Navigation**: Browse quizzes by edition using a paginated sidebar with intuitive navigation
- **Previous/Next Navigation**: Quick navigation buttons to move between quizzes seamlessly
- **Newspaper Style Layout**: Classic newspaper aesthetic with numbered questions and answers displayed in columns
- **12 Questions Standard**: Each quiz contains exactly 12 numbered questions
- **Show/Hide Answers**: Toggle answers visibility with a single button click
- **Dark Mode**: Light and dark theme support with animated starry background in dark mode
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Mobile-First**: Touch-friendly interface with slide-out sidebar drawer on mobile
- **Firebase Integration**: Cloud-based quiz storage for easy content management without manual commits
- **Admin Panel**: Simple web-based interface for adding new quizzes

## Quick Start

### View Online
Visit [https://egil10.github.io/quizquaz/](https://egil10.github.io/quizquaz/) to start browsing quizzes.

### Run Locally

1. Clone or download this repository
2. Start a local server (required for JSON loading):

```bash
# Using Python (recommended)
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open your browser and navigate to `http://localhost:8000`

## Project Structure

```
quizquaz/
├── index.html              # Main application page
├── admin.html              # Admin panel for adding quizzes
├── styles/
│   ├── main.css           # Main application styling
│   └── admin.css          # Admin panel styling
├── js/
│   ├── app.js             # Main application logic
│   ├── admin.js           # Admin panel logic
│   ├── firebase.js        # Firebase integration
│   └── firebase-config.js # Firebase configuration
├── data/
│   └── quizzes.json       # Quiz data storage (fallback)
├── assets/
│   └── favicon.svg        # Application favicon
├── docs/
│   ├── ADMIN_API_KEY.md   # Admin API key documentation
│   ├── FIREBASE_SETUP.md  # Firebase setup guide
│   └── REPOSITORY.md      # Repository documentation
└── README.md              # This file
```

## Adding a New Quiz

### Via Admin Panel (Recommended)

1. Navigate to `admin.html`
2. Enter your 16-character API key
3. Fill in the quiz form:
   - Date (required)
   - Title (required)
   - Edition number (required)
   - 12 questions and answers (all required)
4. Click "Publiser til Firebase" to publish instantly

### Via JSON File (Manual)

Edit `data/quizzes.json` and add a new quiz object to the `quizzes` array:

```json
{
  "id": "2024-01-15",
  "date": "2024-01-15",
  "title": "January 15, 2024",
  "edition": 3,
  "questions": [
    {
      "number": 1,
      "question": "What is the capital of France?",
      "answer": "Paris"
    },
    {
      "number": 2,
      "question": "Who wrote Romeo and Juliet?",
      "answer": "William Shakespeare"
    }
    // ... continue with questions 3-12
  ]
}
```

### Quiz Format Requirements

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier (typically matches the date) | `"2024-01-15"` |
| `date` | string | Quiz date in YYYY-MM-DD format | `"2024-01-15"` |
| `title` | string | Display title (formatted as "Monthname dd, yyyy") | `"January 15, 2024"` |
| `edition` | number | Sequential edition number | `3` |
| `questions` | array | Array of exactly 12 question objects | See below |

Each question object must have:
- `number`: Question number (1-12)
- `question`: The question text
- `answer`: The answer text

**Important**: Each quiz must contain exactly 12 questions numbered 1 through 12.

## Design Philosophy

QuizQuaz is designed with simplicity and readability in mind:

- **Newspaper Aesthetic**: Inspired by traditional print media, with clean typography and a classic two-column layout
- **Static Display**: Questions and answers are displayed as static text—no interactive forms, just pure reading
- **Mobile-First**: Responsive design ensures optimal experience on all devices with touch-friendly controls
- **Accessible**: Semantic HTML and clear structure for screen readers and accessibility tools
- **Focused**: Distraction-free interface that emphasizes content over decoration

## Technology Stack

- **HTML5**: Semantic markup with proper language attributes
- **CSS3**: Modern styling with CSS variables, flexbox, grid, and responsive design
- **Vanilla JavaScript**: ES6+ JavaScript with async/await, no frameworks
- **Firebase Firestore**: Cloud database for quiz storage and real-time updates
- **JSON**: Fallback data storage format
- **Lucide Icons**: Modern icon library for UI elements

## Browser Support

QuizQuaz works in all modern browsers that support:
- ES6 JavaScript (async/await, fetch API)
- CSS Flexbox and Grid
- CSS Custom Properties (variables)
- HTML5 semantic elements

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Mobile Optimization

The application is fully optimized for mobile devices:
- Touch-friendly buttons (minimum 48px height)
- Slide-out sidebar drawer with overlay
- Responsive typography and spacing
- Prevented zoom on input focus
- Optimized loading screen
- Full-width layout on small screens

## Firebase Setup

For cloud-based quiz storage, Firebase Firestore integration is available. See `docs/FIREBASE_SETUP.md` for detailed setup instructions.

## Admin Access

The admin panel uses a simple API key authentication system. The API key is documented in `docs/ADMIN_API_KEY.md` (not tracked in git for security).

## License

This project is open source and available for personal and educational use.

## Contributing

Found a bug or have a suggestion? Feel free to open an issue or submit a pull request.

## Questions?

Visit the [live site](https://egil10.github.io/quizquaz/) to see QuizQuaz in action, or check out the code to understand how it works.
