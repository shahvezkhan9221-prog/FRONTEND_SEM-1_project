let quizData = [];
let currentQuestionIndex = 0;
let userAnswers = {};

const startPage = document.getElementById('quiz-start-page');
const quizPage = document.getElementById('quiz-page');
const resultsPage = document.getElementById('results-page');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const submitBtn = document.getElementById('submit-btn');
const retakeBtn = document.getElementById('retake-btn');
const reviewSection = document.getElementById('quiz-review-section');

async function loadQuestionsFromFile() {
    try {
        const response = await fetch('questions.json');
        const allQuestions = await response.json();
        allQuestions.sort(() => 0.5 - Math.random());
        quizData = allQuestions.slice(0, 15);
    } catch (error) {
        alert("Error loading questions.");
    }
}
loadQuestionsFromFile();

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', () => changeQuestion(1));
prevBtn.addEventListener('click', () => changeQuestion(-1));
submitBtn.addEventListener('click', showResults);
retakeBtn.addEventListener('click', restartQuiz);

function startQuiz() {
    if (quizData.length === 0) return alert("Loading...");
    startPage.classList.add('d-none');
    quizPage.classList.remove('d-none');
    loadQuestionUI();
}

function loadQuestionUI() {
    const data = quizData[currentQuestionIndex];
    document.getElementById('question-text').innerText = data.question;
    document.getElementById('question-counter').innerText = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;

    const optionsForm = document.getElementById('options-form');
    optionsForm.innerHTML = '';

    data.options.forEach((option, index) => {
        const isChecked = userAnswers[currentQuestionIndex] === index ? 'checked' : '';
        optionsForm.innerHTML += `
            <div class="form-check">
                <input type="radio" name="option" class="radio-input" id="opt${index}" 
                       onclick="saveAnswer(${index})" ${isChecked}>
                <label class="option-label" for="opt${index}">${option}</label>
            </div>`;
    });
    updateButtons();
}

function saveAnswer(index) {
    userAnswers[currentQuestionIndex] = index;
}

function changeQuestion(direction) {
    currentQuestionIndex += direction;
    loadQuestionUI();
}

function updateButtons() {
    prevBtn.disabled = (currentQuestionIndex === 0);
    if (currentQuestionIndex === quizData.length - 1) {
        nextBtn.classList.add('d-none');
        submitBtn.classList.remove('d-none');
    } else {
        nextBtn.classList.remove('d-none');
        submitBtn.classList.add('d-none');
    }
}

function showResults() {
    let score = 0;
    let attempted = Object.keys(userAnswers).length;
    reviewSection.innerHTML = '';

    quizData.forEach((question, index) => {
        const userPicked = userAnswers[index];
        const correct = question.answer;

        let statusColor = 'orange';
        let statusText = 'Not Attempted';

        if (userPicked === correct) {
            score++;
            statusColor = 'green';
            statusText = 'Correct';
        } else if (userPicked !== undefined) {
            statusColor = 'red';
            statusText = 'Wrong';
        }

        let optionsHTML = '';
        
        question.options.forEach((opt, optIndex) => {
            let bgColor = 'white';
            let textColor = 'black';
            let border = '1px solid #ddd';

            if (optIndex === correct) {
                bgColor = '#d4edda';
                textColor = '#155724';
                border = '1px solid #c3e6cb';
            }
            else if (optIndex === userPicked && userPicked !== correct) {
                bgColor = '#f8d7da';
                textColor = '#721c24';
                border = '1px solid #f5c6cb';
            }

            optionsHTML += `
                <div style="background-color: ${bgColor}; color: ${textColor}; border: ${border}; padding: 10px; margin-bottom: 5px; border-radius: 5px;">
                    ${opt}
                </div>
            `;
        });

        reviewSection.innerHTML += `
            <div style="background: #fdfdfd; padding: 15px; margin-bottom: 20px; border-radius: 8px; border-left: 6px solid ${statusColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="font-weight: bold; font-size: 1.1em;">Q${index + 1}: ${question.question}</span>
                    <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
                </div>
                <div>${optionsHTML}</div>
            </div>
        `;
    });

    const percentage = Math.round((score / quizData.length) * 100);
    document.getElementById('total-questions').innerText = quizData.length;
    document.getElementById('attempted-count').innerText = attempted;
    document.getElementById('correct-count').innerText = score;
    document.getElementById('incorrect-count').innerText = quizData.length - score;
    document.getElementById('percentage-score').innerText = percentage + "%";

    quizPage.classList.add('d-none');
    resultsPage.classList.remove('d-none');
}

function restartQuiz() {
    location.reload();
}