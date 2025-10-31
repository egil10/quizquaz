# QuizQuaz

A weekly quiz publication system with calendar and edition navigation. Display quizzes in a clean, newspaper-style format with numbered questions and answers.

## Features

- **Calendar Navigation**: Browse quizzes by date using a date picker
- **Edition Navigation**: Navigate between quiz editions using a dropdown
- **Previous/Next Navigation**: Quick navigation buttons to move between quizzes
- **Newspaper Style**: Classic newspaper aesthetic with numbered questions and answers
- **12 Questions Per Quiz**: Each quiz contains exactly 12 questions

## Structure

```
quizquaz/
├── index.html          # Main page
├── styles/
│   └── main.css       # Newspaper-style styling
├── js/
│   └── app.js         # Application logic
└── data/
    └── quizzes.json   # Quiz data storage
```

## Adding a New Quiz

To add a new quiz edition, edit `data/quizzes.json` and add a new quiz object:

```json
{
  "id": "2024-01-15",
  "date": "2024-01-15",
  "title": "Weekly Quiz - January 15, 2024",
  "edition": 3,
  "questions": [
    {
      "number": 1,
      "question": "Your question here?",
      "answer": "Your answer here"
    },
    // ... add 12 questions total (numbered 1-12)
  ]
}
```

### Quiz Format Requirements

- **id**: Unique identifier (typically matches the date)
- **date**: Date in YYYY-MM-DD format
- **title**: Display title for the quiz
- **edition**: Sequential edition number (1, 2, 3, etc.)
- **questions**: Array of exactly 12 question objects
  - **number**: Question number (1-12)
  - **question**: The question text
  - **answer**: The answer text

## Running the Application

Simply open `index.html` in a web browser. For local development, you may need to run a local server to avoid CORS issues:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## Design Philosophy

- **No Interactive Elements**: Questions and answers are displayed as static text (no clicking, no multiple choice)
- **Newspaper Style**: Clean, readable format inspired by traditional newspapers
- **Simple Navigation**: Easy-to-use controls for browsing different editions
- **12 Questions Standard**: Each quiz follows a consistent 12-question format

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript (async/await, fetch API)
- CSS Grid and Flexbox
- HTML5 date input
