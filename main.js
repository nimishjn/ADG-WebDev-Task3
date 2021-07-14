var userData = {
    name: "",
    age: "",
    gender: "",
    email: "",
    score: 0
};

let questions = [];

var questionNumber = -1;

const api_url = "https://task-3-api.herokuapp.com/questions";

async function getapi() {
    const response = await fetch(api_url);
    var data = await response.json();
    console.log(data);
    if (response) {
        return data;
    }
}

async function formSubmit(event) {
    event.preventDefault();
    userData.name = document.getElementById('name').value;
    userData.age = document.getElementById('age').value;
    userData.gender = document.getElementById('age').value;
    userData.email = document.getElementById('email').value;
    console.log(userData);
    document.getElementById('user-form').reset();
    beginQuiz();
}

async function beginQuiz() {
    questions = await getapi();
    questionNumber = 0;
    window.location.replace('./quiz.html');
    renderQuestion();
}

async function renderQuestion() {
    document.getElementById('question-number').innerHTML = `Question ${questionNumber+1}`
    document.getElementById('question-text').innerHTML = questions[questionNumber].question;
    document.getElementById('optionA').innerHTML = questions[questionNumber].optionA;
    document.getElementById('optionB').innerHTML = questions[questionNumber].optionB;
    document.getElementById('optionC').innerHTML = questions[questionNumber].optionC;
    document.getElementById('optionD').innerHTML = questions[questionNumber].optionD;
}