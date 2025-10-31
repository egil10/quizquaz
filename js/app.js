let quizzes = [];
let currentIndex = 0;
let answersVisible = false;

// Initialize app
async function init() {
    await loadQuizzes();
    initTheme();
    setupEventListeners();
    createStars();
    updateUI();
}

// Load quizzes - tries Firestore first, falls back to JSON file
async function loadQuizzes() {
    try {
        // Try Firestore first if configured
        if (typeof isFirebaseConfigured !== 'undefined' && isFirebaseConfigured()) {
            try {
                quizzes = await loadQuizzesFromFirestore();
                console.log('Loaded quizzes from Firestore');
                return;
            } catch (error) {
                console.warn('Firestore load failed, falling back to JSON:', error);
            }
        }
        
        // Fallback to JSON file
        const response = await fetch('data/quizzes.json');
        if (!response.ok) {
            throw new Error('Failed to load quizzes');
        }
        const data = await response.json();
        quizzes = data.quizzes.sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log('Loaded quizzes from JSON file');
    } catch (error) {
        console.error('Error loading quizzes:', error);
        document.getElementById('quizContainer').innerHTML = 
            '<div class="error">Failed to load quizzes. Please check your connection or data file.</div>';
    }
}

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeToggle();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeToggle();
    lucide.createIcons(); // Reinitialize icons after theme change
}

function updateThemeToggle() {
    const isDark = document.body.classList.contains('dark-mode');
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

// Create starry background
function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;

    const numStars = 150;
    const stars = [];

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        const size = Math.random() < 0.7 ? 'small' : Math.random() < 0.9 ? 'medium' : 'large';
        star.className = `star ${size}`;
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        stars.push(star);
    }

    stars.forEach(star => starsContainer.appendChild(star));
}

// Setup event listeners
function setupEventListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const themeToggle = document.getElementById('themeToggle');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                answersVisible = false;
                updateUI();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < quizzes.length - 1) {
                currentIndex++;
                answersVisible = false;
                updateUI();
            }
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Update UI with current quiz
function updateUI() {
    if (quizzes.length === 0) return;

    const quiz = quizzes[currentIndex];
    const container = document.getElementById('quizContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Update navigation buttons
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === quizzes.length - 1;

    // Update sidebar
    updateEditionsSidebar();

    // Display quiz
    container.innerHTML = renderQuiz(quiz);
    
    // Reinitialize icons after rendering
    lucide.createIcons();
    
    // Attach toggle button listener
    const toggleBtn = document.getElementById('toggleAnswersBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleAnswers);
    }
}

// Update editions sidebar
function updateEditionsSidebar() {
    const editionsList = document.getElementById('editionsList');
    if (!editionsList) return;

    editionsList.innerHTML = '';
    quizzes.forEach((quiz, index) => {
        const item = document.createElement('div');
        item.className = `edition-item ${index === currentIndex ? 'active' : ''}`;
        item.innerHTML = `
            <div>
                <span class="edition-item-number">Edition ${quiz.edition}</span>
            </div>
            <div class="edition-item-date">${formatDate(quiz.date)}</div>
        `;
        item.addEventListener('click', () => {
            currentIndex = index;
            answersVisible = false;
            updateUI();
        });
        editionsList.appendChild(item);
    });
    
    // Reinitialize icons after updating sidebar
    lucide.createIcons();
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Toggle answers visibility
function toggleAnswers() {
    answersVisible = !answersVisible;
    const answersList = document.querySelector('.answers-list');
    const answersHeader = document.querySelector('.answers-header');
    const toggleBtn = document.getElementById('toggleAnswersBtn');
    
    if (answersList && toggleBtn) {
        if (answersVisible) {
            answersList.classList.remove('hidden');
            if (answersHeader) answersHeader.classList.remove('hidden');
            toggleBtn.innerHTML = '<i data-lucide="eye-off" class="icon-inline"></i> Hide Answers';
        } else {
            answersList.classList.add('hidden');
            if (answersHeader) answersHeader.classList.add('hidden');
            toggleBtn.innerHTML = '<i data-lucide="eye" class="icon-inline"></i> Show Answers';
        }
        lucide.createIcons(); // Reinitialize icons
    }
}

// Render quiz in newspaper style
function renderQuiz(quiz) {
    const dateFormatted = formatDate(quiz.date);
    
    return `
        <div class="quiz-newspaper">
            <div class="quiz-header">
                <h2>${quiz.title || `Weekly Quiz - ${dateFormatted}`}</h2>
                <div class="quiz-meta">
                    <span class="edition">Edition ${quiz.edition}</span>
                    <span class="date">${dateFormatted}</span>
                </div>
            </div>
            
            <div class="quiz-content">
                <div class="quiz-columns-header">
                    <h3 class="questions-header">Questions</h3>
                    <h3 class="answers-header ${answersVisible ? '' : 'hidden'}">Answers</h3>
                </div>
                
                <div class="quiz-columns">
                    <div class="questions-column">
                        <ol class="questions-list">
                            ${quiz.questions.map(q => `
                                <li>
                                    <span class="question-number">${q.number}.</span>
                                    <span class="question-text">${q.question}</span>
                                </li>
                            `).join('')}
                        </ol>
                        <button id="toggleAnswersBtn" class="toggle-answers-btn">
                            <i data-lucide="${answersVisible ? 'eye-off' : 'eye'}" class="icon-inline"></i>
                            ${answersVisible ? 'Hide Answers' : 'Show Answers'}
                        </button>
                    </div>
                    
                    <ol class="answers-list ${answersVisible ? '' : 'hidden'}">
                        ${quiz.questions.map(q => `
                            <li>
                                <span class="answer-number">${q.number}.</span>
                                <span class="answer-text">${q.answer}</span>
                            </li>
                        `).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
