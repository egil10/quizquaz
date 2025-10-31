# QuizQuaz Repository Documentation

## Overview

QuizQuaz is a web-based quiz application that displays quiz editions in a newspaper-style format. The application allows users to browse through quiz editions and view questions and answers.

**Live Site:** https://egil10.github.io/quizquaz/

## Project Structure

```
quizquaz/
├── index.html              # Main application page
├── assets/
│   └── favicon.svg         # Website favicon (black text on transparent)
├── data/
│   ├── quizzes.json        # Quiz data storage
│   └── funfacts.json       # Fun facts for tagline
├── docs/
│   └── REPOSITORY.md       # This file
├── js/
│   └── app.js             # Main application logic
├── styles/
│   └── main.css           # Main application styles
└── README.md              # Project README
```

## Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling with CSS variables for theming
- **Vanilla JavaScript** - No frameworks, pure JS
- **JSON** - Data storage format
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
   - Sidebar with paginated editions list (6 per page)
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

6. **Dynamic Fun Facts**
   - Random fun fact displayed in tagline on each page load
   - Loaded from `data/funfacts.json`

## File Descriptions

### `index.html`
Main application page. Contains:
- Header with title and theme toggle
- Main content area for quiz display
- Editions sidebar (right side)
- Footer with links

### `js/app.js`
Core application logic:
- `init()` - Initializes the app
- `loadQuizzes()` - Loads quizzes from JSON file
- `loadFunFact()` - Loads random fun fact from JSON
- `updateUI()` - Updates the display with current quiz
- `renderQuiz()` - Renders quiz in newspaper format
- `toggleAnswers()` - Shows/hides answers
- `updateEditionsSidebar()` - Updates sidebar with pagination
- Theme management functions

### `styles/main.css`
Main application styles:
- CSS variables for theming
- Responsive design breakpoints
- Dark mode styles
- Button styles (white bg, black border, black text)
- Fixed sidebar height (600px)
- Consistent quiz container sizing

### `data/quizzes.json`
Quiz data storage:
- Contains array of quiz objects
- Each quiz has: id, date, title, edition, questions array
- Questions array contains 12 question objects with number, question, and answer

### `data/funfacts.json`
Fun facts data:
- Array of strings containing fun facts in Norwegian
- One fact is randomly selected and displayed on page load

## Data Structure

### Quiz Object Format

```json
{
  "id": "2024-01-01",
  "date": "2024-01-01",
  "title": "1. januar 2024",
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

## Adding Quizzes

### Direct JSON Editing

1. Edit `data/quizzes.json`
2. Add quiz object following the format above
3. Ensure the quiz has exactly 12 questions numbered 1-12
4. Commit and push to GitHub
5. GitHub Pages will rebuild automatically

**Important:** Each quiz must contain exactly 12 questions numbered 1 through 12.

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
- Border radius: 2px (more square)
- No outlines on focus
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

## Troubleshooting

### Quizzes Not Loading

1. Check browser console for errors
2. Verify `data/quizzes.json` exists and is valid JSON
3. Ensure all quizzes have exactly 12 questions
4. Check that JSON structure matches expected format

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
