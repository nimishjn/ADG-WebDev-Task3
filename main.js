var userData = {
    name: "",
    age: "",
    gender: "",
    email: "",
    score: 0
};
class questionHandler {
    static questions = [];
    static questionNumber = 0;
    static answerSelected = [false, false, false, false, false, false, false, false, false, false];
    static reset() {
        this.questionNumber = 0;
        this.answerSelected = [false, false, false, false, false, false, false, false, false, false];
    }
    static setQuestions(q) {
        this.questions = q;
    }
    static getQuestion() {
        return this.questions[this.questionNumber];
    }
    static getSelectedAnswerIndex() {
        return this.answerSelected[this.questionNumber].charCodeAt(0) - 65;
    }
    static getAnswerSelected() {
        return this.answerSelected[this.questionNumber];
    }
    static setAnswerSelected(answer) {
        this.answerSelected[this.questionNumber] = answer;
    }
    static getFinalScore() {
        var s = 0;
        for(var i = 0; i < this.questions.length; i++) {
            if(this.questions[i].correctOption === this.answerSelected[i]) {
                s+=1;
            }
        }
        return s;
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

async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
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
    questionHandler.reset();
    document.querySelector('body').innerHTML = await fetchHtmlAsText("./quiz.html");
    renderQuestion();
    countdown(10, 0);
}

//Change this entire function
async function renderQuestion() {
    document.getElementById('question-number').innerHTML = questionHandler.questionNumber + 1;
    document.getElementById('question-text').innerHTML = questionHandler.getQuestion().question;
    document.getElementById('optionA').innerHTML = questionHandler.getQuestion().optionA;
    document.getElementById('optionB').innerHTML = questionHandler.getQuestion().optionB;
    document.getElementById('optionC').innerHTML = questionHandler.getQuestion().optionC;
    document.getElementById('optionD').innerHTML = questionHandler.getQuestion().optionD;
    var radio = document.getElementsByName("options");
    if(questionHandler.getAnswerSelected()) {
        radio[questionHandler.getSelectedAnswerIndex()].checked = true;
    } else {
        for(var i=0;i<radio.length;i++)
            radio[i].checked = false;
    }
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

async function radioClicked() {
    var radio = document.getElementsByName("options");
    for(var i=0;i<radio.length;i++) {
        if(radio[i].checked == true) {
            questionHandler.setAnswerSelected(String.fromCharCode(65 + i));
        }
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
    userData.score = questionHandler.getFinalScore();
    console.log(userData.score);
    console.log("Quiz submitted!");
    document.querySelector('body').innerHTML = await fetchHtmlAsText("./score.html");
    document.getElementById('score').innerHTML = userData.score.toString();
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