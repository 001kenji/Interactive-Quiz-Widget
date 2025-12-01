// script.js
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

    // Initialize quiz
    function initQuiz() {
        loadQuestion();
        updateProgress();
        updateButtons();
        
        // Set initial status
        statusIndicator.className = 'status-indicator ready';
        dataStatus.textContent = 'Ready to collect data';
    }

    // Load question
    function loadQuestion() {
        const question = quizData[currentQuestion];
        questionText.textContent = question.question;
        questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Create option elements
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
        
        // Deselect all options
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select clicked option
        document.querySelectorAll('.option')[index].classList.add('selected');
        selectedOptions[currentQuestion] = index;
        
        // Check if answer is correct
        if (index === quizData[currentQuestion].correctAnswer) {
            if (selectedOptions[currentQuestion] !== index) {
                score++;
                scoreElement.textContent = score;
            }
        } else {
            // If previously selected correct answer, decrease score
            if (selectedOptions[currentQuestion] === quizData[currentQuestion].correctAnswer) {
                score--;
                scoreElement.textContent = score;
            }
        }
        
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
        
        // Enable next/submit only if an option is selected
        const isOptionSelected = selectedOptions[currentQuestion] !== null;
        nextBtn.disabled = !isOptionSelected;
        submitBtn.disabled = !isOptionSelected;
    }

    // Show results
    function showResults() {
        quizCompleted = true;
        
        // Calculate final score
        let finalScoreValue = 0;
        selectedOptions.forEach((selected, index) => {
            if (selected === quizData[index].correctAnswer) {
                finalScoreValue++;
            }
        });
        
        finalScore.textContent = finalScoreValue;
        
        // Set result message
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
        
        // Hide quiz body, show results
        document.querySelector('.quiz-body').style.display = 'none';
        resultContainer.style.display = 'block';
        
        // Send data to Google Sheets
        sendToGoogleSheets(finalScoreValue);
    }

    // Send data to Google Sheets (simulated)
    async function sendToGoogleSheets(finalScoreValue) {
        // In a real implementation, this would be your Google Apps Script URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyD1ac_a7eT2AcgQYibheFKUlG2eaIy2Ztb29MdXYU_GbzVABgjhvt284Low6wLlEJc/exec';
        
        // Mock data for the quiz
        const quizResults = {
            timestamp: new Date().toISOString(),
            name: "Quiz Participant",
            email: "participant@example.com",
            score: finalScoreValue,
            totalQuestions: quizData.length,
            percentage: Math.round((finalScoreValue / quizData.length) * 100),
            timeSpent: Math.floor(Math.random() * 120) + 30 // Random time between 30-150 seconds
        };
        
        // Update UI to show sending status
        dataStatus.textContent = 'Sending data to Google Sheets...';
        statusIndicator.className = 'status-indicator active';
        
        try {
            // In a real implementation, you would use:
            // const response = await fetch(scriptURL, {
            //     method: 'POST',
            //     mode: 'no-cors',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(quizResults)
            // });
            
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulate successful response
            dataStatus.textContent = 'Data successfully sent to Google Sheets!';
            statusIndicator.className = 'status-indicator active';
            
            console.log('Data sent to Google Sheets:', quizResults);
            
        } catch (error) {
            console.error('Error sending data:', error);
            dataStatus.textContent = 'Failed to send data. Using fallback storage.';
            statusIndicator.className = 'status-indicator inactive';
            
            // Fallback: Store in localStorage
            localStorage.setItem('quizResults', JSON.stringify({
                ...quizResults,
                storedLocally: true
            }));
        }
    }

    // Test connection to Google Sheets
    async function testConnection() {
        dataStatus.textContent = 'Testing connection to Google Sheets...';
        statusIndicator.className = 'status-indicator ready';
        
        try {
            // Simulate connection test
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            dataStatus.textContent = 'Connection test successful!';
            statusIndicator.className = 'status-indicator active';
            
            // Reset after 3 seconds
            setTimeout(() => {
                if (!quizCompleted) {
                    dataStatus.textContent = 'Ready to collect data';
                    statusIndicator.className = 'status-indicator ready';
                }
            }, 3000);
            
        } catch (error) {
            dataStatus.textContent = 'Connection test failed';
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
    
    testConnectionBtn.addEventListener('click', testConnection);

    // Initialize the quiz
    initQuiz();
});