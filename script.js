// script.js - SIMPLIFIED WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    // Quiz data
    const quizData = [
        {
            question: "Which of the following is NOT a JavaScript data type?",
            options: ["String", "Boolean", "Float", "Symbol"],
            correctAnswer: 2
        },
        {
            question: "What does CSS stand for?",
            options: [
                "Computer Style Sheets",
                "Creative Style System",
                "Cascading Style Sheets",
                "Colorful Style Sheets"
            ],
            correctAnswer: 2
        },
        {
            question: "Which HTML5 element is used for drawing graphics via scripting?",
            options: ["<canvas>", "<svg>", "<draw>", "<graphic>"],
            correctAnswer: 0
        },
        {
            question: "What is the purpose of the 'fetch' API in JavaScript?",
            options: [
                "To retrieve data from a server",
                "To fetch DOM elements",
                "To get user input",
                "To load CSS files dynamically"
            ],
            correctAnswer: 0
        },
        {
            question: "Which method is used to add a class to an HTML element in JavaScript?",
            options: [
                "element.addClass()",
                "element.className()",
                "element.classList.add()",
                "element.setClass()"
            ],
            correctAnswer: 2
        }
    ];

    // DOM Elements
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const questionCounter = document.getElementById('questionCounter');
    const scoreElement = document.getElementById('score');
    const progressBar = document.getElementById('progressBar');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const resultContainer = document.getElementById('resultContainer');
    const finalScore = document.getElementById('finalScore');
    const resultMessage = document.getElementById('resultMessage');
    const restartBtn = document.getElementById('restartBtn');
    const viewSheetBtn = document.getElementById('viewSheetBtn');
    const dataStatus = document.getElementById('dataStatus');
    const statusIndicator = document.getElementById('statusIndicator');
    const testConnectionBtn = document.getElementById('testConnectionBtn');
    const sheetModal = document.getElementById('sheetModal');
    const closeModal = document.querySelector('.close-modal');

    // Quiz state
    let currentQuestion = 0;
    let score = 0;
    let selectedOptions = new Array(quizData.length).fill(null);
    let quizCompleted = false;
    let startTime = Date.now();

    // REPLACE THIS WITH YOUR ACTUAL GOOGLE SCRIPT URL
    // Get this after deploying your Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyD1ac_a7eT2AcgQYibheFKUlG2eaIy2Ztb29MdXYU_GbzVABgjhvt284Low6wLlEJc/exec';

    // Initialize quiz
    function initQuiz() {
        startTime = Date.now();
        loadQuestion();
        updateProgress();
        updateButtons();
        
        statusIndicator.className = 'status-indicator ready';
        dataStatus.textContent = 'Ready to collect data';
    }

    // Load question
    function loadQuestion() {
        const question = quizData[currentQuestion];
        questionText.textContent = question.question;
        questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
        
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            if (selectedOptions[currentQuestion] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.innerHTML = `
                <span class="option-label">${String.fromCharCode(65 + index)}</span>
                ${option}
            `;
            
            optionElement.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        updateProgress();
    }

    // Select option
    function selectOption(index) {
        if (quizCompleted) return;
        
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        document.querySelectorAll('.option')[index].classList.add('selected');
        selectedOptions[currentQuestion] = index;
        
        if (index === quizData[currentQuestion].correctAnswer) {
            score++;
        } else {
            if (selectedOptions[currentQuestion] === quizData[currentQuestion].correctAnswer) {
                score--;
            }
        }
        
        scoreElement.textContent = score;
        updateButtons();
    }

    // Update progress bar
    function updateProgress() {
        const progress = ((currentQuestion + 1) / quizData.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentQuestion === 0;
        nextBtn.style.display = currentQuestion < quizData.length - 1 ? 'flex' : 'none';
        submitBtn.style.display = currentQuestion === quizData.length - 1 ? 'flex' : 'none';
        
        const isOptionSelected = selectedOptions[currentQuestion] !== null;
        nextBtn.disabled = !isOptionSelected;
        submitBtn.disabled = !isOptionSelected;
    }

    // Show results
    function showResults() {
        quizCompleted = true;
        
        let finalScoreValue = 0;
        selectedOptions.forEach((selected, index) => {
            if (selected === quizData[index].correctAnswer) {
                finalScoreValue++;
            }
        });
        
        finalScore.textContent = finalScoreValue;
        
        let message = '';
        if (finalScoreValue === quizData.length) {
            message = 'Perfect! You got all questions right!';
        } else if (finalScoreValue >= quizData.length * 0.7) {
            message = 'Great job! You have a good understanding of web development.';
        } else if (finalScoreValue >= quizData.length * 0.5) {
            message = 'Good effort! Keep learning and practicing.';
        } else {
            message = 'Keep studying! Web development takes practice.';
        }
        resultMessage.textContent = message;
        
        document.querySelector('.quiz-body').style.display = 'none';
        resultContainer.style.display = 'block';
        
        sendToGoogleSheets(finalScoreValue);
    }

    // Send data to Google Sheets - WORKING VERSION
    // Send data to Google Sheets - JSON VERSION
    async function sendToGoogleSheets(finalScoreValue) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        
        dataStatus.textContent = 'Sending data to Google Sheets...';
        statusIndicator.className = 'status-indicator ready';
        
        // Prepare data as JSON object
        const quizDataPayload = {
            name: 'Quiz Participant',
            email: 'participant@example.com',
            score: finalScoreValue,
            totalQuestions: quizData.length,
            percentage: Math.round((finalScoreValue / quizData.length) * 100),
            timeSpent: timeSpent,
            answers: selectedOptions
        };
        
        console.log('Sending data:', quizDataPayload);
        
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quizDataPayload)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                dataStatus.textContent = 'Data saved to Google Sheets!';
                statusIndicator.className = 'status-indicator active';
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
            dataStatus.textContent = 'Error sending data';
            statusIndicator.className = 'status-indicator inactive';
            
            // Try alternative method if JSON fails
            sendViaAlternativeMethod(quizDataPayload);
        }
    }

    // Alternative method using FormData
    async function sendViaAlternativeMethod(data) {
        console.log('Trying alternative method...');
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('score', data.score);
        formData.append('totalQuestions', data.totalQuestions);
        formData.append('percentage', data.percentage);
        formData.append('timeSpent', data.timeSpent);
        formData.append('answers', JSON.stringify(data.answers));
        
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });
            
            console.log('Alternative method response:', response);
            dataStatus.textContent = 'Data sent (alternative method)';
            statusIndicator.className = 'status-indicator active';
        } catch (error) {
            console.error('Alternative method also failed:', error);
        }
    }

    // Test connection
    async function testConnection() {
        dataStatus.textContent = 'Testing connection...';
        statusIndicator.className = 'status-indicator ready';
        
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL + '?test=true');
            
            if (response.ok) {
                const result = await response.json();
                console.log('Connection test:', result);
                dataStatus.textContent = 'Connection successful!';
                statusIndicator.className = 'status-indicator active';
                
                setTimeout(() => {
                    if (!quizCompleted) {
                        dataStatus.textContent = 'Ready to collect data';
                        statusIndicator.className = 'status-indicator ready';
                    }
                }, 3000);
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            dataStatus.textContent = 'Connection failed';
            statusIndicator.className = 'status-indicator inactive';
        }
    }

    // Reset quiz
    function resetQuiz() {
        currentQuestion = 0;
        score = 0;
        selectedOptions = new Array(quizData.length).fill(null);
        quizCompleted = false;
        
        scoreElement.textContent = '0';
        document.querySelector('.quiz-body').style.display = 'block';
        resultContainer.style.display = 'none';
        
        initQuiz();
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion();
            updateButtons();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            loadQuestion();
            updateButtons();
        }
    });

    submitBtn.addEventListener('click', showResults);
    restartBtn.addEventListener('click', resetQuiz);
    testConnectionBtn.addEventListener('click', testConnection);
    
    viewSheetBtn.addEventListener('click', () => {
        sheetModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        sheetModal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === sheetModal) {
            sheetModal.style.display = 'none';
        }
    });

    // Initialize
    initQuiz();
});