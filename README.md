# QuizQuaz 📰

**[🌐 View Live Site](https://egil10.github.io/quizquaz/)**

A weekly quiz publication system with calendar and edition navigation. Display quizzes in a clean, newspaper-style format with numbered questions and answers—perfect for daily or weekly quiz challenges.

---

## ✨ Features

- **📅 Calendar Navigation**: Browse quizzes by date using an intuitive date picker
- **📚 Edition Navigation**: Navigate between quiz editions using a dropdown menu
- **⬅️➡️ Previous/Next Navigation**: Quick navigation buttons to move between quizzes seamlessly
- **📰 Newspaper Style**: Classic newspaper aesthetic with numbered questions and answers
- **🔢 12 Questions Standard**: Each quiz contains exactly 12 numbered questions
- **📱 Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **🎨 Clean Interface**: Simple, distraction-free reading experience

---

## 🚀 Quick Start

### View Online
Simply visit **[https://egil10.github.io/quizquaz/](https://egil10.github.io/quizquaz/)** to start browsing quizzes!

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

---

## 📁 Project Structure

```
quizquaz/
├── index.html          # Main application page
├── styles/
│   └── main.css       # Newspaper-style styling
├── js/
│   └── app.js         # Application logic and navigation
├── data/
│   └── quizzes.json   # Quiz data storage (JSON format)
└── README.md          # This file
```

---

## 📝 Adding a New Quiz

To add a new quiz edition, simply edit `data/quizzes.json` and add a new quiz object to the `quizzes` array:

```json
{
  "id": "2024-01-15",
  "date": "2024-01-15",
  "title": "Weekly Quiz - January 15, 2024",
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
    },
    // ... continue with questions 3-12
  ]
}
```

### Quiz Format Requirements

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier (typically matches the date) | `"2024-01-15"` |
| `date` | string | Quiz date in YYYY-MM-DD format | `"2024-01-15"` |
| `title` | string | Display title for the quiz | `"Weekly Quiz - January 15, 2024"` |
| `edition` | number | Sequential edition number | `3` |
| `questions` | array | Array of exactly 12 question objects | See below |

Each question object must have:
- `number`: Question number (1-12)
- `question`: The question text
- `answer`: The answer text

**Important**: Each quiz must contain exactly 12 questions numbered 1 through 12.

---

## 🎨 Design Philosophy

QuizQuaz is designed with simplicity and readability in mind:

- **📖 Newspaper Aesthetic**: Inspired by traditional print media, with clean typography and a classic layout
- **🚫 No Interactive Elements**: Questions and answers are displayed as static text—no clicking, no multiple choice forms, just pure reading
- **📱 Mobile-Friendly**: Responsive design ensures a great experience on all devices
- **♿ Accessible**: Semantic HTML and clear structure for screen readers and accessibility tools
- **🎯 Focused**: Distraction-free interface that lets you focus on the content

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and responsive design
- **Vanilla JavaScript**: No frameworks, just pure ES6+ JavaScript
- **JSON**: Simple data storage format

---

## 🌐 Browser Support

QuizQuaz works in all modern browsers that support:
- ES6 JavaScript (async/await, fetch API)
- CSS Flexbox and modern CSS features
- HTML5 date input

Tested and working on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

---

## 📄 License

This project is open source and available for personal and educational use.

---

## 🤝 Contributing

Found a bug or have a suggestion? Feel free to open an issue or submit a pull request!

---

## 📧 Questions?

Visit the **[live site](https://egil10.github.io/quizquaz/)** to see QuizQuaz in action, or check out the code to understand how it works.

Happy quizzing! 🎯
