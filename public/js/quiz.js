const waitingPage = document.getElementById("waiting-box")
const generatingQuestionPage = document.getElementById("generating-question")
const difficultyField = document.getElementById("difficulty-field")
const categiryField = document.getElementById("category-field")
const timerField = document.getElementById("timer-field")
const participantField = document.getElementById("participants-field")


window.addEventListener('load', () => {
    getQuestions()
    fixQuizDetails()

}) 

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
        localStorage.setItem("questions", JSON.stringify(result.data) ) 
        console.log(result)
    })
    .catch(error => {
        alert(error)
    });
    
}

function fixQuizDetails(){
    difficultyField.textContent = localStorage.getItem("difficultyText")
    categiryField.textContent = localStorage.getItem("categoryText")
    timerField.textContent = localStorage.getItem("numOfSecs")
    participantField.textContent = localStorage.getItem("expectedParticipants")
}