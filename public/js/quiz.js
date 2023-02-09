const waitingPage = document.getElementById("waiting-box")
const generatingQuestionPage = document.getElementById("generating-question")
const difficultyField = document.getElementById("difficulty-field")
const categiryField = document.getElementById("category-field")
const timerField = document.getElementById("timer-field")
const participantField = document.getElementById("participants-field")
const tbody = document.querySelector(".expected-participants tbody")

const quitQuizBtn = document.getElementById("quit-quiz")

let quizBox = document.querySelector(".quiz_box")
let resultBox = document.querySelector(".result_box")

let questions
let counter
let counterLine
let currentQuestion = 0
let questionNum = 1
let userScore = 0
const option_list = document.querySelector(".option_list");
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
let next_btn = document.querySelector("footer .next_btn");
let timeText = document.querySelector(".timer .time_left_txt");
timeText.textContent = parseInt(localStorage.getItem("numOfSecs"))
let timeCount = document.querySelector(".timer .timer_sec");
let time_line = document.querySelector("header .time_line");

let questionCounterFooter = document.getElementById("current-question")

const questionTime = parseInt(localStorage.getItem("numOfSecs"))

window.addEventListener('load', () => {
    getQuestions()
    fixQuizDetails()

}) 

// if Next Que button clicked
next_btn.onclick = ()=>{
    if(currentQuestion < questions.length - 1){ //if question count is less than total question length
        currentQuestion++; //increment the que_count value
        questionNum++; //increment the que_numb value
        showQuestions(currentQuestion); //calling showQestions function
        queCounter(questionNum); //passing que_numb value to queCounter
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        startTimer(questionTime); //calling startTimer function
        startTimerLine(0); //calling startTimerLine function
        timeText.textContent = "Time Left"; //change the timeText to Time Left
        next_btn.classList.remove("show"); //hide the next button
    }else{
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        showResult(); //calling showResult function
    }
}



function getQuestions(){
    var myHeaders = new Headers();
    let authToken = localStorage.getItem("x-auth-token")

    myHeaders.append("x-auth-token", authToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "categoryId": parseInt(localStorage.getItem("category")),
        "difficultyId": parseInt(localStorage.getItem("difficulty"))
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("/question", requestOptions)
    .then(async response => {
        if (!response.ok) {
            response = await response.json()
            throw new Error(response.message);
        }
        return response.json();
    })
    .then(result =>{
        
        waitingPage.classList.toggle("activeInfo")
        generatingQuestionPage.classList.toggle("activeInfo")
        localStorage.setItem("questions", JSON.stringify(result.data.questions) ) 
        questions = result.data.questions

        document.getElementById("total-questions").textContent = questions.length

        timeText.textContent = "Time Left"

        showQuestions(currentQuestion)
        
    })
    .catch(error => {
        console.log(error)
        alert(error)
    });
    
}

function fixQuizDetails(){
    difficultyField.textContent = localStorage.getItem("difficultyText")
    categiryField.textContent = localStorage.getItem("categoryText")
    timerField.textContent = localStorage.getItem("numOfSecs")
    participantField.textContent = localStorage.getItem("expectedParticipants")

    if(parseInt(localStorage.getItem("expectedParticipants")) === 1){
        document.getElementById("loading-spinner").classList.toggle("invisible")
    }

    let tr = document.createElement('tr');
    
    let idTd = document.createElement('td');
    idTd.textContent = JSON.parse(localStorage["user-data"]).id;
    tr.appendChild(idTd);

    let usernameTd = document.createElement('td');
    usernameTd.textContent = JSON.parse(localStorage["user-data"]).username;
    tr.appendChild(usernameTd);

    tbody.appendChild(tr);


}


function closeModal(element){
    element.parentElement.parentElement.classList.toggle("activeInfo")
}


function startQuiz(){
    quizBox.classList.toggle("activeQuiz")

    startTimer(questionTime)
    startTimerLine(0) 

}

function optionSelected(answer){
    userInput = answer.dataset.option
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine

    if(questions[currentQuestion].answer === userInput){
        answer.classList.add("correct"); //adding green color to correct selected option
        answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option

        userScore += 10
    }

    else{
        answer.classList.add("incorrect"); //adding red color to correct selected option
        answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option

        let correctAnswer = document.querySelector(`[data-option=${questions[currentQuestion].answer}]`)

        correctAnswer.classList.add("correct"); //adding green color to correct selected option
        
        correctAnswer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option

    }

    for(i=0; i < 4; i++){
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
    }

    next_btn.classList.toggle("show")
}


function startTimer(time){
    counter = setInterval(timer, 1000);
    
    function timer(){
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if(time < 9){ //if timer is less than 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "Time Off"; //change the time text to time off
    
            let correctAnswer = document.querySelector(`[data-option=${questions[0].answer}]`)
    
            correctAnswer.classList.add("correct"); //adding green color to correct selected option
            
            correctAnswer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
            
            for(i=0; i < 4; i++){
                option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
            }
            
            next_btn.classList.add("show"); //show the next button if user selected any option
        }
    }
}


function startTimerLine(time){
    counterLine = setInterval(timer, questionTime*2);
    function timer(){
        time += 1; //upgrading time value with 1
        time_line.style.width = time + "px"; //increasing width of time_line with px by time value
        if(time > 549){ //if time value is greater than 549
            clearInterval(counterLine); //clear counterLine
        }
    }
}


function showQuestions(index){
    document.querySelector(".que_text span").textContent = questions[index].question
    
    document.querySelector(".option_list").innerHTML = ''

    let options = ["a", "b", "c", "d"]
    for (i=0; i<options.length; i++){
        var div = document.createElement("div");
        div.setAttribute("class", "option");
        div.setAttribute("data-option", options[i]);
        div.onclick = function() {
            optionSelected(this);
        };
        var span = document.createElement("span");
        span.innerHTML = questions[index][`${options[i]}`]
        div.appendChild(span);

        option_list.appendChild(div);
    }
}

function queCounter(index){
    //creating a new span tag and passing the question number and total question
    questionCounterFooter.textContent = index
}

function showResult(){
    quizBox.classList.toggle("activeQuiz")
    resultBox.classList.toggle("activeResult"); //hide quiz box
    const scoreText = resultBox.querySelector(".score_text");
    let numberOfQuestions = questions.length
    if (userScore > 30){ // if user scored more than 3
        //creating a new span tag and passing the user score number and total question number
        let scoreTag = '<span>and congrats! 🎉, You got <p>'+ userScore +'</p> out of <p>'+ numberOfQuestions +'</p></span>';
        scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else if(userScore > 10){ // if user scored more than 1
        let scoreTag = '<span>and nice 😎, You got <p>'+ userScore +'</p> out of <p>'+ numberOfQuestions +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else{ // if user scored less than 1
        let scoreTag = '<span>and sorry 😐, You got only <p>'+ userScore +'</p> out of <p>'+ numberOfQuestions +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }

    var myHeaders = new Headers();
    let authToken = localStorage.getItem("x-auth-token")
    myHeaders.append("x-auth-token", authToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "quizId": parseInt(localStorage.getItem("quizId")),
        "score": userScore
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("/participation", requestOptions)
    .then(async response => {
        if (!response.ok) {
            response = await response.json()
            throw new Error(response.message);
        }
        return response.json();
    })
    .then(result =>{
        
        console.log(result)
    })
    .catch(error => {
        alert(error)
    });
}

quitQuizBtn.addEventListener("click", () => {
    window.location.href = "/home"
})