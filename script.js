const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const startBtn = document.getElementById('start-btn');
const categorySelect = document.getElementById('category-select');

let currentQuiz = 0;
let score = 0;
let quizData = [];

startBtn.addEventListener('click', () => {
    const selectedCategory = categorySelect.value;
    fetchQuizData(selectedCategory);
});

async function fetchQuizData(category) {
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`);
    const data = await response.json();
    quizData = data.results.map((item) => {
        const incorrectAnswers = item.incorrect_answers;
        const correctAnswer = item.correct_answer;
        const allAnswers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);
        return {
            question: item.question,
            a: allAnswers[0],
            b: allAnswers[1],
            c: allAnswers[2],
            d: allAnswers[3],
            correct: correctAnswer
        };
    });
    startScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    submitBtn.style.display = 'block';
    loadQuiz();
}

function loadQuiz() {
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz];
    questionEl.innerHTML = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}

function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false);
}

function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.nextElementSibling.innerText;
        }
    });
    return answer;
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    if(answer) {
        if(answer === quizData[currentQuiz].correct) {
            score++;
        }
        currentQuiz++;
        if(currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            quiz.innerHTML = `
                <h2>You answered ${score}/${quizData.length} questions correctly</h2>
                <button onclick="location.reload()">Reload</button>
            `;
        }
    }
});
