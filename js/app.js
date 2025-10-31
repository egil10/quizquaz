let quizzes = [];
let currentIndex = 0;

// Initialize app
async function init() {
    await loadQuizzes();
    setupEventListeners();
    updateUI();
}

// Load quizzes from JSON file
async function loadQuizzes() {
    try {
        const response = await fetch('data/quizzes.json');
        if (!response.ok) {
            throw new Error('Failed to load quizzes');
        }
        const data = await response.json();
        quizzes = data.quizzes.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
        console.error('Error loading quizzes:', error);
        document.getElementById('quizContainer').innerHTML = 
            '<div class="error">Failed to load quizzes. Please check the data file.</div>';
    }
}

// Setup event listeners
function setupEventListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const editionSelect = document.getElementById('editionSelect');
    const dateSelect = document.getElementById('dateSelect');

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateUI();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < quizzes.length - 1) {
            currentIndex++;
            updateUI();
        }
    });

    editionSelect.addEventListener('change', (e) => {
        const edition = parseInt(e.target.value);
        const index = quizzes.findIndex(q => q.edition === edition);
        if (index !== -1) {
            currentIndex = index;
            updateUI();
        }
    });

    dateSelect.addEventListener('change', (e) => {
        const date = e.target.value;
        const index = quizzes.findIndex(q => q.date === date);
        if (index !== -1) {
            currentIndex = index;
            updateUI();
        }
    });
}

// Update UI with current quiz
function updateUI() {
    if (quizzes.length === 0) return;

    const quiz = quizzes[currentIndex];
    const container = document.getElementById('quizContainer');
    const editionSelect = document.getElementById('editionSelect');
    const dateSelect = document.getElementById('dateSelect');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Update navigation buttons
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === quizzes.length - 1;

    // Update selects
    updateEditionSelect(editionSelect);
    updateDateSelect(dateSelect);

    // Display quiz
    container.innerHTML = renderQuiz(quiz);
}

// Update edition select dropdown
function updateEditionSelect(select) {
    select.innerHTML = '';
    quizzes.forEach(quiz => {
        const option = document.createElement('option');
        option.value = quiz.edition;
        option.textContent = `Edition ${quiz.edition} - ${formatDate(quiz.date)}`;
        if (quiz.edition === quizzes[currentIndex].edition) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

// Update date select input
function updateDateSelect(input) {
    input.value = quizzes[currentIndex].date;
    input.min = quizzes[0]?.date || '';
    input.max = quizzes[quizzes.length - 1]?.date || '';
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
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
                <section class="questions-section">
                    <h3>Questions</h3>
                    <ol class="questions-list">
                        ${quiz.questions.map(q => `
                            <li>
                                <span class="question-number">${q.number}.</span>
                                <span class="question-text">${q.question}</span>
                            </li>
                        `).join('')}
                    </ol>
                </section>
                
                <div class="separator"></div>
                
                <section class="answers-section">
                    <h3>Answers</h3>
                    <ol class="answers-list">
                        ${quiz.questions.map(q => `
                            <li>
                                <span class="answer-number">${q.number}.</span>
                                <span class="answer-text">${q.answer}</span>
                            </li>
                        `).join('')}
                    </ol>
                </section>
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

