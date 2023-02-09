let h3Tag = document.querySelector('div.user-name-section span h3');
let h5Tag = document.querySelector('div.user-name-section h5');
let createQuizBtn = document.querySelector("button.create-quiz-btn")
let joinQuiz = document.querySelector("buttoon.join-quiz-btn")
let profileDiv = document.querySelector("div.profile-div")
let sendCreateQuizRequestBtn = document.getElementById("create-quiz-send-request")

const quizTypeRadioButton = document.querySelectorAll('input[name="quiz-type"]');
const nextAfterQuizTypeBtn = document.getElementById('next-after-quiz-type');

const quizDifficultyRadioButton = document.querySelectorAll('input[name="quiz-difficulty"]');
const nextAfterQuizDifficultyBtn = document.getElementById('next-after-quiz-difficulty');

let isQuizTypeRadioSelected = false;
let isQuizDifficultyRadioSelected = false;

let quizTypeModal = document.querySelector("#quiz-type")

let tbody = document.querySelector('.quiz-history-section tbody');

const quizCategoryDropDown = document.getElementById("quiz-category-dropdown");
const expectedParticipantsInput = document.getElementById("expected-participants");

const numberOfSecondsInput = document.getElementById("num-of-secs");



let category
let difficulty
let expectedParticipants = 1
let quizType = "single"
let numOfSecs = 10
let difficultyText
let categoryText


window.addEventListener('load', () => {
    getUsersQuiz()
    getAllCategories()
    getAllDifficulties()
    localStorage.setItem("expectedParticipants", '1')
}) 

function getUsersQuiz(){

    var myHeaders = new Headers();

    let authToken = localStorage.getItem("x-auth-token")

    myHeaders.append("x-auth-token", authToken);
    myHeaders.append("Content-Type", "application/json");
    
    try{

        var raw = JSON.stringify({
          "userId": JSON.parse(localStorage.getItem("user-data")).id
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("/participation/postFilter", requestOptions)
        .then(async response => {
            if(response.status === 403){
                window.location.href = "/"
            }
            if (!response.ok) {
                response = await response.json()
                throw new Error(response.message);
            }
            return response.json();
        })
        .then(result =>{
            
            let resultData = result.data
    
            let username = JSON.parse(localStorage.getItem("user-data")).username
            let firstname = JSON.parse(localStorage.getItem("user-data")).firstname
            let lastname = JSON.parse(localStorage.getItem("user-data")).lastname
    
            h3Tag.textContent = firstname + " " + lastname;
            h5Tag.textContent = username;
            
            console.log(resultData)
            
            for(i=0; i<resultData.length; i++){
                let tr = document.createElement('tr');
    
                let idTd = document.createElement('td');
                idTd.textContent = resultData[i].recordid;
                tr.appendChild(idTd);
    
                let usernameTd = document.createElement('td');
                usernameTd.textContent = resultData[i].username;
                tr.appendChild(usernameTd);
    
                let categoryTd = document.createElement('td');
                categoryTd.textContent = resultData[i].quizCategory;
                tr.appendChild(categoryTd);
    
                let difficultyTd = document.createElement('td');
                difficultyTd.textContent = resultData[i].quizDifficulty;
                tr.appendChild(difficultyTd);
    
                let scoreTd = document.createElement('td');
                scoreTd.textContent = resultData[i].score;
                tr.appendChild(scoreTd);
    
                let rankTd = document.createElement('td');
                rankTd.textContent = resultData[i].rank;
                tr.appendChild(rankTd);
    
                tbody.appendChild(tr);
            }
    
        
        })
        .catch(error => {
            alert(error)
        });
    }
    catch(err){
        window.location.href = '/'
    }

    
}


function getAllCategories(){
    var myHeaders = new Headers();

    let authToken = localStorage.getItem("x-auth-token")

    myHeaders.append("x-auth-token", authToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/category", requestOptions)
    .then(async response => {
        if (!response.ok) {
            response = await response.json()
            throw new Error(response.message);
        }
        return response.json();
    })
    .then(result =>{        
        localStorage.setItem("categories", JSON.stringify(result.data))
        categories = result.data
        categories.forEach(category => {
            const option = document.createElement("option");
            option.textContent = category.name;
            option.value = category.id;
            quizCategoryDropDown.appendChild(option);
        });
    })
    .catch(error => {
        alert(error)
    });

}


function getAllDifficulties(){
    var myHeaders = new Headers();

    let authToken = localStorage.getItem("x-auth-token")

    myHeaders.append("x-auth-token", authToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("/difficulty", requestOptions)
    .then(async response => {
        if (!response.ok) {
            response = await response.json()
            throw new Error(response.message);
        }
        return response.json();
    })
    .then(result =>{        
        localStorage.setItem("difficulties", JSON.stringify(result.data))
    })
    .catch(error => {
        alert(error)
    });

}

function closeModal(element){
    element.parentElement.parentElement.classList.toggle("activeInfo")
}

function previousModal(element){
    document.getElementById(element.getAttribute('data-previous')).classList.toggle('activeInfo')
}

function toggleProfileDiv(){
    profileDiv.classList.toggle("invisible")
}

createQuizBtn.addEventListener("click", () => {
    quizTypeModal.classList.toggle("activeInfo")
})

quizTypeRadioButton.forEach(radioButton => {
    radioButton.addEventListener('click', function() {
      isQuizTypeRadioSelected = true;
      nextAfterQuizTypeBtn.removeAttribute('disabled');
      nextAfterQuizTypeBtn.setAttribute('data-next', radioButton.getAttribute('data-next'));
    });
});
  
nextAfterQuizTypeBtn.addEventListener('click', function() {
    if (!isQuizTypeRadioSelected) {
        nextAfterQuizTypeBtn.setAttribute('disabled', '');
    }
});

function nextModal(element){
    document.getElementById(element.getAttribute('data-next')).classList.toggle('activeInfo')
}

 
quizDifficultyRadioButton.forEach(radioButton => {
    radioButton.addEventListener('click', function() {
        isQuizDifficultyRadioSelected = true;
      nextAfterQuizDifficultyBtn.removeAttribute('disabled');
    });
});
  
nextAfterQuizDifficultyBtn.addEventListener('click', function() {
    if (!isQuizTypeRadioSelected) {
        nextAfterQuizDifficultyBtn.setAttribute('disabled', '');
    }
});

quizCategoryDropDown.addEventListener('change', (event) => {
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex];
    const selectedText = selectedOption.text;
    localStorage.setItem("categoryText", selectedText)
  });

function setQuizType(){
    for (let i = 0; i < quizTypeRadioButton.length; i++) {
        if (quizTypeRadioButton[i].checked) {
            quizType = quizTypeRadioButton[i].value;
            break;
        }
    }
    localStorage.setItem("quizType", quizType)
}

function setQuizDifficulty(){
    for (let i = 0; i < quizDifficultyRadioButton.length; i++) {
        if (quizDifficultyRadioButton[i].checked) {
            difficulty = quizDifficultyRadioButton[i].value;
            break;
        }
    }
    
    localStorage.setItem("difficulty", difficulty)
    
}

quizDifficultyRadioButton.forEach((input) => {
    input.addEventListener('change', (event) => {
      const selectedLabel = event.target.nextElementSibling.textContent;

      localStorage.setItem("difficultyText", selectedLabel)

    });
});


function setExpectedParticipants(){
    expectedParticipants = expectedParticipantsInput.value

    if(expectedParticipants === ""){
        console.log("This is empty")
        expectedParticipants = 1
    }

    localStorage.setItem("expectedParticipants", expectedParticipants)
}

function setCategories(){
    category = quizCategoryDropDown.options[quizCategoryDropDown.selectedIndex].value;
    numOfSecs = numberOfSecondsInput.value;

    if(numOfSecs === ""){
        numOfSecs = 10
    }

    localStorage.setItem("category", category)
    localStorage.setItem("numOfSecs", numOfSecs)

}

function createQuiz(){
    var myHeaders = new Headers();
    let authToken = localStorage.getItem("x-auth-token")
    myHeaders.append("x-auth-token", authToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "category": parseInt(localStorage.getItem("category")),
        "difficulty": parseInt(localStorage.getItem("difficulty")) ,
        "quizType": localStorage.getItem("quizType"),
        "expectedParticipants": parseInt(localStorage.getItem("expectedParticipants"))
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("/quiz/", requestOptions)
    .then(async response => {
        if (!response.ok) {
            response = await response.json()
            throw new Error(response.message);
        }
        return response.json();
    })
    .then(result =>{
        
        localStorage.setItem("quizId", result.data.id)
        window.location.href = "/startQuiz"
    })
    .catch(error => {
        alert(error)
    });
}