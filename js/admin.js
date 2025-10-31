// API Key (16 characters) - Change this to your own secret key
const ADMIN_API_KEY = 'QUIZQUAZ2024API'; // Change this!

// Simple hash function for API key verification
function hashApiKey(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        const char = key.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

// Store hashed API key in localStorage (set this once)
const STORED_HASH = hashApiKey(ADMIN_API_KEY);

let isAuthenticated = false;

// Initialize admin page
function initAdmin() {
    // Load Firebase config
    loadFirebaseConfig();
    
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
        if (isFirebaseConfigured()) {
            showAdminForm();
        } else {
            showFirebaseSetup();
        }
    } else {
        setupApiKeyScreen();
    }
    initTheme();
    createStars();
}

// Load Firebase configuration
function loadFirebaseConfig() {
    // Config is in firebase-config.js
}

// Check if Firebase is configured
function isFirebaseConfigured() {
    return window.firebaseConfig && 
           window.firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
           window.firebaseConfig.projectId !== 'YOUR_PROJECT_ID';
}

// Setup API key authentication screen
function setupApiKeyScreen() {
    const apiKeyScreen = document.getElementById('apiKeyScreen');
    const adminForm = document.getElementById('adminForm');
    const githubSetup = document.getElementById('githubSetup');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKeySubmit = document.getElementById('apiKeySubmit');
    const apiKeyError = document.getElementById('apiKeyError');

    apiKeyScreen.style.display = 'block';
    adminForm.style.display = 'none';
    if (firebaseSetup) firebaseSetup.style.display = 'none';

    apiKeySubmit.addEventListener('click', () => {
        const enteredKey = apiKeyInput.value.trim();
        
        if (enteredKey.length !== 16) {
            apiKeyError.textContent = 'API key must be exactly 16 characters.';
            apiKeyError.style.display = 'block';
            return;
        }

        const enteredHash = hashApiKey(enteredKey);
        
        if (enteredHash === STORED_HASH || enteredKey === ADMIN_API_KEY) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            if (isFirebaseConfigured()) {
                showAdminForm();
            } else {
                showFirebaseSetup();
            }
        } else {
            apiKeyError.textContent = 'Invalid API key. Access denied.';
            apiKeyError.style.display = 'block';
            apiKeyInput.value = '';
        }
    });

    apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            apiKeySubmit.click();
        }
    });
}

// Show Firebase setup
function showFirebaseSetup() {
    const apiKeyScreen = document.getElementById('apiKeyScreen');
    const adminForm = document.getElementById('adminForm');
    const firebaseSetup = document.getElementById('firebaseSetup');
    
    apiKeyScreen.style.display = 'none';
    adminForm.style.display = 'none';
    if (firebaseSetup) firebaseSetup.style.display = 'block';
    
    setupFirebaseConfig();
    lucide.createIcons();
}

// Setup Firebase configuration (instructions shown, config is in firebase-config.js)
function setupFirebaseConfig() {
    // Firebase config is in js/firebase-config.js
    // User needs to edit that file with their Firebase credentials
    // Check if configured
    if (isFirebaseConfigured()) {
        const statusDiv = document.getElementById('firebaseStatus');
        if (statusDiv) {
            statusDiv.className = 'success-message';
            statusDiv.innerHTML = '<i data-lucide="check-circle" class="icon-inline"></i> Firebase is configured!';
            statusDiv.style.display = 'block';
        }
        setTimeout(() => {
            showAdminForm();
        }, 1500);
    }
}

// Show admin form
function showAdminForm() {
    const apiKeyScreen = document.getElementById('apiKeyScreen');
    const adminForm = document.getElementById('adminForm');
    const firebaseSetup = document.getElementById('firebaseSetup');
    
    apiKeyScreen.style.display = 'none';
    if (firebaseSetup) firebaseSetup.style.display = 'none';
    adminForm.style.display = 'block';
    
    // Show Firebase connected status
    if (isFirebaseConfigured()) {
        const connectedDiv = document.getElementById('firebaseConnected');
        if (connectedDiv) connectedDiv.style.display = 'flex';
    }
    
    setupQuizForm();
    generateQuestionInputs();
    checkForDraft();
    lucide.createIcons();
}

// Generate 12 question input fields
function generateQuestionInputs() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '';
    
    for (let i = 1; i <= 12; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${i}</span>
            </div>
            <div class="form-group">
                <label>Question Text</label>
                <input type="text" class="form-input question-input" data-q="${i}" placeholder="Enter question ${i}" required>
            </div>
            <div class="form-group">
                <label>Answer</label>
                <input type="text" class="form-input answer-input" data-q="${i}" placeholder="Enter answer ${i}" required>
            </div>
        `;
        questionsList.appendChild(questionDiv);
    }
    
    lucide.createIcons();
}

// Setup quiz form
function setupQuizForm() {
    const form = document.getElementById('quizForm');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const loadDraftBtn = document.getElementById('loadDraftBtn');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('quizDate').value = today;
    
    form.addEventListener('submit', handleFormSubmit);
    saveDraftBtn.addEventListener('click', saveDraft);
    loadDraftBtn.addEventListener('click', loadDraft);
    
    // Auto-save draft every 30 seconds
    setInterval(() => {
        if (document.getElementById('quizForm').checkValidity()) {
            saveDraft(true); // Silent save
        }
    }, 30000);
}

// Save draft
function saveDraft(silent = false) {
    const formData = {
        date: document.getElementById('quizDate').value,
        title: document.getElementById('quizTitle').value,
        edition: document.getElementById('quizEdition').value,
        questions: []
    };
    
    for (let i = 1; i <= 12; i++) {
        const questionInput = document.querySelector(`.question-input[data-q="${i}"]`);
        const answerInput = document.querySelector(`.answer-input[data-q="${i}"]`);
        
        if (questionInput && answerInput) {
            formData.questions.push({
                number: i,
                question: questionInput.value.trim(),
                answer: answerInput.value.trim()
            });
        }
    }
    
    localStorage.setItem('quizquaz_draft', JSON.stringify(formData));
    
    if (!silent) {
        showSuccessMessage('Draft saved! You can continue later.');
    }
    
    const loadDraftBtn = document.getElementById('loadDraftBtn');
    loadDraftBtn.style.display = 'inline-flex';
}

// Load draft
function loadDraft() {
    const draft = localStorage.getItem('quizquaz_draft');
    if (!draft) return;
    
    const formData = JSON.parse(draft);
    
    document.getElementById('quizDate').value = formData.date || '';
    document.getElementById('quizTitle').value = formData.title || '';
    document.getElementById('quizEdition').value = formData.edition || '';
    
    formData.questions.forEach(q => {
        const questionInput = document.querySelector(`.question-input[data-q="${q.number}"]`);
        const answerInput = document.querySelector(`.answer-input[data-q="${q.number}"]`);
        if (questionInput) questionInput.value = q.question;
        if (answerInput) answerInput.value = q.answer;
    });
    
    showSuccessMessage('Draft loaded!');
}

// Check for draft
function checkForDraft() {
    const draft = localStorage.getItem('quizquaz_draft');
    if (draft) {
        document.getElementById('loadDraftBtn').style.display = 'inline-flex';
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const date = document.getElementById('quizDate').value;
    const title = document.getElementById('quizTitle').value;
    const edition = parseInt(document.getElementById('quizEdition').value);
    
    const questions = [];
    let valid = true;
    
    for (let i = 1; i <= 12; i++) {
        const questionInput = document.querySelector(`.question-input[data-q="${i}"]`);
        const answerInput = document.querySelector(`.answer-input[data-q="${i}"]`);
        
        const questionText = questionInput.value.trim();
        const answerText = answerInput.value.trim();
        
        if (!questionText || !answerText) {
            valid = false;
            questionInput.style.borderColor = '#d32f2f';
            answerInput.style.borderColor = '#d32f2f';
            continue;
        }
        
        questionInput.style.borderColor = '';
        answerInput.style.borderColor = '';
        
        questions.push({
            number: i,
            question: questionText,
            answer: answerText
        });
    }
    
    if (!valid || questions.length !== 12) {
        showError('Please fill in all 12 questions and answers.');
        return;
    }
    
    const quiz = {
        id: date,
        date: date,
        title: title,
        edition: edition,
        questions: questions
    };
    
    // Show loading
    document.getElementById('loadingIndicator').style.display = 'flex';
    document.getElementById('submitText').textContent = 'Publishing...';
    
    try {
        // Try to publish to Firebase
        if (isFirebaseConfigured()) {
            await saveQuizToFirestore(quiz);
            // Clear draft on success
            localStorage.removeItem('quizquaz_draft');
            showSuccess('Quiz published successfully to Firebase! It\'s live now!');
        } else {
            // Fallback: download file
            const updatedJSON = await generateUpdatedQuizzesJSON(quiz);
            downloadJSONFile(updatedJSON, 'quizzes.json');
            showSuccess('Firebase not configured. Quiz JSON downloaded. Please upload to GitHub manually or configure Firebase.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to publish: ' + error.message);
    } finally {
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('submitText').textContent = 'Publish to Firebase';
    }
    
    // Reset form after delay
    setTimeout(() => {
        e.target.reset();
        document.getElementById('quizDate').value = new Date().toISOString().split('T')[0];
        generateQuestionInputs();
    }, 3000);
}

// Publish to GitHub
async function publishToGitHub(newQuiz) {
    const [owner, repo] = githubConfig.repo.split('/');
    
    // Fetch current file
    const fileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/quizzes.json`, {
        headers: {
            'Authorization': `token ${githubConfig.token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    let currentContent = '';
    let sha = null;
    
    if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        currentContent = atob(fileData.content.replace(/\n/g, ''));
        sha = fileData.sha;
    } else if (fileResponse.status === 404) {
        // File doesn't exist, create new
        currentContent = '{"quizzes":[]}';
    } else {
        throw new Error('Failed to fetch current quizzes.json');
    }
    
    // Parse and update
    const data = JSON.parse(currentContent);
    
    // Check if quiz exists
    const existingIndex = data.quizzes.findIndex(
        q => q.edition === newQuiz.edition || q.id === newQuiz.id
    );
    
    if (existingIndex !== -1) {
        data.quizzes[existingIndex] = newQuiz;
    } else {
        data.quizzes.push(newQuiz);
    }
    
    // Sort by date
    data.quizzes.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Commit to GitHub
    const updatedContent = JSON.stringify(data, null, 2);
    const encodedContent = btoa(updatedContent);
    
    const commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/quizzes.json`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${githubConfig.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add quiz edition ${newQuiz.edition} - ${newQuiz.title}`,
            content: encodedContent,
            sha: sha
        })
    });
    
    if (!commitResponse.ok) {
        const error = await commitResponse.json();
        throw new Error(error.message || 'Failed to commit to GitHub');
    }
}

// Fetch current quizzes.json and merge with new quiz
async function generateUpdatedQuizzesJSON(newQuiz) {
    try {
        const response = await fetch('data/quizzes.json');
        if (!response.ok) {
            throw new Error('Failed to fetch current quizzes');
        }
        const data = await response.json();
        
        const existingIndex = data.quizzes.findIndex(
            q => q.edition === newQuiz.edition || q.id === newQuiz.id
        );
        
        if (existingIndex !== -1) {
            data.quizzes[existingIndex] = newQuiz;
        } else {
            data.quizzes.push(newQuiz);
        }
        
        data.quizzes.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return JSON.stringify(data, null, 2);
    } catch (error) {
        const data = { quizzes: [newQuiz] };
        return JSON.stringify(data, null, 2);
    }
}

// Download JSON file
function downloadJSONFile(jsonContent, filename) {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show success message
function showSuccess(message) {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    successMsg.querySelector('span').textContent = message;
    successMsg.style.display = 'flex';
    errorMsg.style.display = 'none';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

// Show error message
function showError(message) {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.querySelector('span').textContent = message;
    errorMsg.style.display = 'flex';
    successMsg.style.display = 'none';
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 5000);
}

// Legacy function for compatibility
function showSuccessMessage(customMessage) {
    showSuccess(customMessage || 'Quiz added successfully!');
}

// Theme management (same as main app)
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Create stars (same as main app)
function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;

    const numStars = 150;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        const size = Math.random() < 0.7 ? 'small' : Math.random() < 0.9 ? 'medium' : 'large';
        star.className = `star ${size}`;
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        starsContainer.appendChild(star);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    initAdmin();
}
