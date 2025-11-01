let quizzes = [];
let currentIndex = 0;
let answersVisible = false;

// Initialize app
async function init() {
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    await loadQuizzes();
    await loadFunFact();
    initTheme();
    setupEventListeners();
    createStars();
    updateUI();
    
    // Hide loading screen after everything is loaded
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const layoutContainer = document.querySelector('.layout-container');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        if (layoutContainer) {
            layoutContainer.classList.add('loaded');
        }
        if (header) {
            header.classList.add('loaded');
        }
        if (footer) {
            footer.classList.add('loaded');
        }
        
        // Ensure scroll to top after loading screen is hidden
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }, 500);
}

// Load and display a random fun fact
async function loadFunFact() {
    try {
        const response = await fetch('data/funfacts.json');
        if (!response.ok) {
            throw new Error('Failed to load fun facts');
        }
        const data = await response.json();
        const funFacts = data.funfacts;
        
        if (funFacts && funFacts.length > 0) {
            const randomIndex = Math.floor(Math.random() * funFacts.length);
            const funFactElement = document.getElementById('funFact');
            if (funFactElement) {
                funFactElement.textContent = funFacts[randomIndex];
            }
        }
    } catch (error) {
        console.error('Error loading fun facts:', error);
        const funFactElement = document.getElementById('funFact');
        if (funFactElement) {
            funFactElement.textContent = 'Spennende quizutgaver venter på deg!';
        }
    }
}

// Load quizzes from JSON file
// Only shows quizzes with dates <= today (scheduled publication)
async function loadQuizzes() {
    try {
        const response = await fetch('data/quizzes.json');
        if (!response.ok) {
            throw new Error('Failed to load quizzes');
        }
        const data = await response.json();
        
        // Get today's date (midnight) for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Filter out quizzes with future dates (not yet published)
        const allQuizzes = data.quizzes || [];
        quizzes = allQuizzes
            .filter(quiz => {
                const quizDate = new Date(quiz.date);
                quizDate.setHours(0, 0, 0, 0);
                return quizDate <= today;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
        
        const hiddenCount = allQuizzes.length - quizzes.length;
        if (hiddenCount > 0) {
            console.log(`Loaded ${quizzes.length} published quizzes, ${hiddenCount} scheduled for future publication`);
        } else {
            console.log(`Loaded ${quizzes.length} quizzes from JSON file`);
        }
        
        // Ensure currentIndex is valid after filtering
        if (currentIndex >= quizzes.length && quizzes.length > 0) {
            currentIndex = quizzes.length - 1; // Go to last available quiz
        } else if (quizzes.length === 0) {
            currentIndex = 0;
        }
    } catch (error) {
        console.error('Error loading quizzes:', error);
        document.getElementById('quizContainer').innerHTML = 
            '<div class="error">Kunne ikke laste quizzer. Vennligst sjekk tilkoblingen eller datafilen.</div>';
    }
}

// Helper function to generate future publication dates
// Example: generateWeeklyDates('2025-01-06', 12) generates 12 dates starting from Jan 6, 2025 (every Monday)
// Usage: Add quizzes with these dates to quizzes.json, and they'll automatically appear when their date arrives
function generateWeeklyDates(startDate, numberOfWeeks = 52, dayOfWeek = 1) {
    // dayOfWeek: 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
    const dates = [];
    const start = new Date(startDate);
    
    // Find the next occurrence of the specified day of week
    const dayDiff = (dayOfWeek - start.getDay() + 7) % 7;
    const firstDate = new Date(start);
    firstDate.setDate(start.getDate() + dayDiff);
    
    for (let i = 0; i < numberOfWeeks; i++) {
        const date = new Date(firstDate);
        date.setDate(firstDate.getDate() + (i * 7));
        dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    
    return dates;
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
        themeToggle.setAttribute('aria-label', isDark ? 'Bytt til lys modus' : 'Bytt til mørk modus');
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
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Update UI with current quiz
function updateUI() {
    if (quizzes.length === 0) {
        const container = document.getElementById('quizContainer');
        if (container) {
            container.innerHTML = '<div class="error">Ingen quizutgaver er tilgjengelige akkurat nå. Sjekk tilbake senere!</div>';
        }
        return;
    }

    const quiz = quizzes[currentIndex];
    const container = document.getElementById('quizContainer');

    // Display quiz
    container.innerHTML = renderQuiz(quiz);
    
    // Reinitialize icons after rendering
    lucide.createIcons();
    
    // Attach toggle button listeners
    const toggleBtn = document.getElementById('toggleAnswersBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleAnswers);
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex < quizzes.length - 1) {
                currentIndex++; // Go to older quiz (back in time)
                answersVisible = false;
                updateUI();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--; // Go to newer quiz (forward in time)
                answersVisible = false;
                updateUI();
            }
        });
    }
}


// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
}

// Format date for quiz title (Weekday, dd. monthname yyyy)
function formatDateForTitle(dateString) {
    const date = new Date(dateString);
    const weekdays = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
    
    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Format: "FREDAG, 28. OKTOBER 2025" (all caps)
    return `${weekday.toUpperCase()}, ${day}. ${month.toUpperCase()} ${year}`;
}

// Toggle answers visibility
function toggleAnswers() {
    answersVisible = !answersVisible;
    const toggleBtn = document.getElementById('toggleAnswersBtn');
    
    if (toggleBtn) {
        toggleBtn.innerHTML = answersVisible 
            ? '<i data-lucide="eye-off" class="icon-inline"></i> Skjul svar'
            : '<i data-lucide="eye" class="icon-inline"></i> Svar';
        lucide.createIcons();
    }
    
    // Re-render the quiz to show/hide answers section
    updateUI();
    
    // Scroll to top of answers section when showing
    if (answersVisible) {
        setTimeout(() => {
            const answersSection = document.querySelector('.answers-section');
            if (answersSection) {
                answersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}

// Render quiz in newspaper style
function renderQuiz(quiz) {
    const dateFormatted = formatDate(quiz.date);
    const titleDate = formatDateForTitle(quiz.date);
    
    return `
        <div class="quiz-newspaper">
            <div class="quiz-header desktop-header">
                <div class="quiz-header-top">
                    <h2>${titleDate}</h2>
                </div>
                <div class="quiz-meta">
                    <span class="edition">Utgave ${quiz.edition} / ${quizzes.length}</span>
                </div>
            </div>
            
            <div class="quiz-header mobile-header">
                <h2>${titleDate}</h2>
                <span class="edition">Utgave ${quiz.edition} / ${quizzes.length}</span>
            </div>
            
            <div class="quiz-content">
                <div class="quiz-columns-header desktop-header">
                    <h3 class="questions-header">Spørsmål</h3>
                </div>
                
                <div class="questions-section">
                    <h3 class="questions-header-mobile mobile-header">Spørsmål</h3>
                    
                    <div class="questions-two-columns">
                        <div class="questions-column-left">
                            ${quiz.introImage ? `
                            <div class="quiz-intro-image-container">
                                <img src="${quiz.introImage}" alt="Quiz intro image" class="quiz-image-positioned" loading="lazy">
                            </div>
                            ` : ''}
                            <ol class="questions-list">
                                ${quiz.questions.slice(0, 6).map(q => `
                                    <li>
                                        <span class="question-number">${q.number}.</span>
                                        <span class="question-text">${q.question}</span>
                                    </li>
                                `).join('')}
                            </ol>
                        </div>
                        <div class="questions-column-right">
                            <ol class="questions-list">
                                ${quiz.questions.slice(6).map(q => `
                                    <li>
                                        <span class="question-number">${q.number}.</span>
                                        <span class="question-text">${q.question}</span>
                                    </li>
                                `).join('')}
                            </ol>
                            ${quiz.midImage ? `
                            <div class="quiz-mid-image-container">
                                <img src="${quiz.midImage}" alt="Quiz mid image" class="quiz-image-positioned" loading="lazy">
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="quiz-actions">
                        <button id="prevBtn" class="nav-btn desktop-nav" ${currentIndex === quizzes.length - 1 ? 'disabled' : ''}>
                            <i data-lucide="chevron-left" class="icon-inline"></i>
                            Forrige
                        </button>
                        <button id="toggleAnswersBtn" class="toggle-answers-btn">
                            <i data-lucide="${answersVisible ? 'eye-off' : 'eye'}" class="icon-inline"></i>
                            ${answersVisible ? 'Skjul svar' : 'Svar'}
                        </button>
                        <button id="nextBtn" class="nav-btn desktop-nav" ${currentIndex === 0 ? 'disabled' : ''}>
                            Neste
                            <i data-lucide="chevron-right" class="icon-inline"></i>
                        </button>
                        <div class="quiz-actions-info">
                            <span class="quiz-actions-date">${titleDate}</span>
                            <span class="quiz-actions-edition">Utgave ${quiz.edition} / ${quizzes.length}</span>
                        </div>
                    </div>
                </div>
                
                ${answersVisible ? `
                <div class="answers-section">
                    <h3 class="answers-header desktop-header">Svar</h3>
                    <h3 class="answers-header-mobile mobile-header">Svar</h3>
                    <div class="answers-two-columns">
                        <div class="answers-column-left">
                            <ol class="answers-list">
                                ${quiz.questions.slice(0, 6).map(q => `
                                    <li>
                                        <span class="answer-number">${q.number}.</span>
                                        <span class="answer-text">${q.answer}</span>
                                    </li>
                                `).join('')}
                            </ol>
                        </div>
                        <div class="answers-column-right">
                            <ol class="answers-list">
                                ${quiz.questions.slice(6).map(q => `
                                    <li>
                                        <span class="answer-number">${q.number}.</span>
                                        <span class="answer-text">${q.answer}</span>
                                    </li>
                                `).join('')}
                            </ol>
                        </div>
                    </div>
                </div>
                ` : ''}
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

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Set today's date in footer
function setTodayDate() {
    const today = new Date();
    const weekdays = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
    
    const weekday = weekdays[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    
    // Format: "LØRDAG, 1. NOVEMBER 2025" (all caps)
    const formattedDate = `${weekday.toUpperCase()}, ${day}. ${month.toUpperCase()} ${year}`;
    
    const todayDateElement = document.getElementById('todayDate');
    if (todayDateElement) {
        todayDateElement.textContent = formattedDate;
    }
}

setTodayDate();

// Initialize Lucide icons
lucide.createIcons();
