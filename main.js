var userData = {
    name: "",
    age: "",
    gender: "",
    email: "",
    score: 0
};
class questionHandler {
    static questions = [];
    static questionNumber = -1;
    static setQuestions(q) {
        this.questions = q;
    }
    static getQuestion() {
        return this.questions[this.questionNumber];
    }
}

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
    questionHandler.setQuestions(await getapi());
    questionHandler.questionNumber = 0;
    let a = document.createElement('a');
    a.href = "./quiz.html";
    a.target = "_blank";
    a.click();
    renderQuestion();
    countdown(10, 0);
}

//Change this entire function
async function renderQuestion() {
    document.getElementById('question-number').innerHTML = `Question ${questionHandler.questionNumber + 1}`;
    document.getElementById('question-text').innerHTML = questionHandler.getQuestion().question;
    document.getElementById('optionA').innerHTML = questionHandler.getQuestion().optionA;
    document.getElementById('optionB').innerHTML = questionHandler.getQuestion().optionB;
    document.getElementById('optionC').innerHTML = questionHandler.getQuestion().optionC;
    document.getElementById('optionD').innerHTML = questionHandler.getQuestion().optionD;
    console.log("Created questions!");
    if(questionHandler.questionNumber === 9) {
        document.getElementById('next-button').innerHTML = 'Submit';
    }
    else {
        document.getElementById('next-button').innerHTML = 'Next';
    }
    if(questionHandler.questionNumber === 0) {
        document.getElementById('previous-button').disabled = true;
    }
    else {
        document.getElementById('previous-button').disabled = false;
    }
}

async function nextQuestion() {
    if(questionHandler.questionNumber == 9) {
        quizOnSubmit();
    }
    else {
        questionHandler.questionNumber += 1;
        renderQuestion();
    }
    
}

async function previousQuestion() {
    questionHandler.questionNumber -= 1;
    renderQuestion();
}

async function quizOnSubmit() {
    // userData.score = calculateScore();
    console.log("Quiz submitted!");
    let a = document.createElement('a');
    a.href = "./score.html";
    a.click();
}

function countdown(minutes, seconds)
{
    var element = document.getElementById('time');
    var endTime, hours, mins, msLeft, time;

    function twoDigits(n)
    {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer()
    {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            quizOnSubmit();
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    element = document.getElementById('time');
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}