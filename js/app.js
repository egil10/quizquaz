let quizzes = [];
let currentIndex = 0;
let answersVisible = false;
let editionsPage = 0;
const editionsPerPage = 6;

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

// Load quizzes - tries Firestore first, falls back to JSON file
async function loadQuizzes() {
    try {
        // Try Firestore first if configured
        if (typeof isFirebaseConfigured !== 'undefined' && isFirebaseConfigured()) {
            try {
                const firestoreQuizzes = await loadQuizzesFromFirestore();
                console.log('Loaded quizzes from Firestore');
                
                // If Firestore has quizzes, use them
                if (firestoreQuizzes && firestoreQuizzes.length > 0) {
                    quizzes = firestoreQuizzes;
                    return;
                } else {
                    console.log('Firestore is empty, falling back to JSON');
                }
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
            '<div class="error">Kunne ikke laste quizzer. Vennligst sjekk tilkoblingen eller datafilen.</div>';
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
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
    }

    setupEditionsPagination();
    setupSidebarOverlay();
}

// Toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.getElementById('editionsSidebar');
    if (sidebar) {
        sidebar.classList.toggle('hidden');
        document.body.classList.toggle('sidebar-hidden');
        
        // Prevent body scroll when sidebar is open on mobile
        if (window.innerWidth <= 480) {
            if (sidebar.classList.contains('hidden')) {
                document.body.style.overflow = '';
            } else {
                document.body.style.overflow = 'hidden';
            }
        }
    }
}

// Close sidebar when clicking overlay on mobile
function setupSidebarOverlay() {
    if (window.innerWidth <= 480) {
        document.body.addEventListener('click', function(e) {
            const sidebar = document.getElementById('editionsSidebar');
            const toggleBtn = document.getElementById('toggleSidebarBtn');
            
            // If sidebar is open and we clicked outside of it (on the overlay)
            if (sidebar && !sidebar.classList.contains('hidden') && 
                !sidebar.contains(e.target) && 
                toggleBtn && !toggleBtn.contains(e.target)) {
                toggleSidebar();
            }
        });
    }
}

// Update UI with current quiz
function updateUI() {
    if (quizzes.length === 0) return;

    const quiz = quizzes[currentIndex];
    const container = document.getElementById('quizContainer');

    // Update sidebar
    updateEditionsSidebar();

    // Display quiz
    container.innerHTML = renderQuiz(quiz);
    
    // Reinitialize icons after rendering
    lucide.createIcons();
    
    // Reattach sidebar toggle button listener (since it's now in the quiz content)
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
    }
    
    // Attach toggle button listeners
    const toggleBtn = document.getElementById('toggleAnswersBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleAnswers);
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                answersVisible = false;
                // Switch to page containing this quiz if needed
                const quizPage = Math.floor(currentIndex / editionsPerPage);
                if (quizPage !== editionsPage) {
                    editionsPage = quizPage;
                }
                updateUI();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < quizzes.length - 1) {
                currentIndex++;
                answersVisible = false;
                // Switch to page containing this quiz if needed
                const quizPage = Math.floor(currentIndex / editionsPerPage);
                if (quizPage !== editionsPage) {
                    editionsPage = quizPage;
                }
                updateUI();
            }
        });
    }
}


// Update editions sidebar
function updateEditionsSidebar() {
    const editionsList = document.getElementById('editionsList');
    if (!editionsList) return;

    // Calculate pagination
    const totalPages = Math.ceil(quizzes.length / editionsPerPage);
    const startIndex = editionsPage * editionsPerPage;
    const endIndex = Math.min(startIndex + editionsPerPage, quizzes.length);
    const currentPageQuizzes = quizzes.slice(startIndex, endIndex);

    // Update page info
    const pageInfo = document.getElementById('editionsPageInfo');
    const prevPageBtn = document.getElementById('editionsPrevPage');
    const nextPageBtn = document.getElementById('editionsNextPage');

    if (pageInfo) {
        pageInfo.textContent = `${editionsPage + 1} / ${totalPages || 1}`;
    }

    if (prevPageBtn) {
        prevPageBtn.disabled = editionsPage === 0;
    }

    if (nextPageBtn) {
        nextPageBtn.disabled = editionsPage >= totalPages - 1;
    }

    // Render current page items
    editionsList.innerHTML = '';
    currentPageQuizzes.forEach((quiz, localIndex) => {
        const globalIndex = startIndex + localIndex;
        const item = document.createElement('div');
        item.className = `edition-item ${globalIndex === currentIndex ? 'active' : ''}`;
        item.innerHTML = `
            <div>
                <span class="edition-item-number">Utgave ${quiz.edition}</span>
            </div>
            <div class="edition-item-date">${formatDate(quiz.date)}</div>
        `;
        item.addEventListener('click', () => {
            currentIndex = globalIndex;
            answersVisible = false;
            updateUI();
            // Switch to page containing this quiz if needed
            const quizPage = Math.floor(globalIndex / editionsPerPage);
            if (quizPage !== editionsPage) {
                editionsPage = quizPage;
                updateEditionsSidebar();
            }
        });
        editionsList.appendChild(item);
    });
    
    // Reinitialize icons after updating sidebar
    lucide.createIcons();
}

// Pagination event listeners
function setupEditionsPagination() {
    const prevPageBtn = document.getElementById('editionsPrevPage');
    const nextPageBtn = document.getElementById('editionsNextPage');

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (editionsPage > 0) {
                editionsPage--;
                updateEditionsSidebar();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(quizzes.length / editionsPerPage);
            if (editionsPage < totalPages - 1) {
                editionsPage++;
                updateEditionsSidebar();
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

// Format date for quiz title (Monthname dd, yyyy)
function formatDateForTitle(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { 
        year: 'numeric', 
        month: 'long', 
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
            toggleBtn.innerHTML = '<i data-lucide="eye-off" class="icon-inline"></i> Skjul svar';
        } else {
            answersList.classList.add('hidden');
            if (answersHeader) answersHeader.classList.add('hidden');
            toggleBtn.innerHTML = '<i data-lucide="eye" class="icon-inline"></i> Svar';
        }
        lucide.createIcons(); // Reinitialize icons
        
        // No need to sync height - sidebar has fixed height
    }
}

// Render quiz in newspaper style
function renderQuiz(quiz) {
    const dateFormatted = formatDate(quiz.date);
    const titleDate = formatDateForTitle(quiz.date);
    
    return `
        <div class="quiz-newspaper">
            <div class="quiz-header">
                <div class="quiz-header-top">
                    <h2>${titleDate}</h2>
                    <button id="toggleSidebarBtn" class="toggle-sidebar-btn" aria-label="Toggle editions sidebar">
                        <i data-lucide="menu" class="icon-inline sidebar-icon-open"></i>
                        <i data-lucide="x" class="icon-inline sidebar-icon-close"></i>
                    </button>
                </div>
                <div class="quiz-meta">
                    <span class="edition">Utgave ${quiz.edition}</span>
                </div>
            </div>
            
            <div class="quiz-content">
                <div class="quiz-columns-header">
                    <h3 class="questions-header">Spørsmål</h3>
                    <h3 class="answers-header ${answersVisible ? '' : 'hidden'}">Svar</h3>
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
                        <div class="quiz-actions">
                            <button id="prevBtn" class="nav-btn" ${currentIndex === 0 ? 'disabled' : ''}>
                                <i data-lucide="chevron-left" class="icon-inline"></i>
                                Forrige
                            </button>
                            <button id="toggleAnswersBtn" class="toggle-answers-btn">
                                <i data-lucide="${answersVisible ? 'eye-off' : 'eye'}" class="icon-inline"></i>
                                ${answersVisible ? 'Skjul svar' : 'Svar'}
                            </button>
                            <button id="nextBtn" class="nav-btn" ${currentIndex === quizzes.length - 1 ? 'disabled' : ''}>
                                Neste
                                <i data-lucide="chevron-right" class="icon-inline"></i>
                            </button>
                        </div>
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
