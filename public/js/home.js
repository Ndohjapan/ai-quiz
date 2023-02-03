let h3Tag = document.querySelector('div.user-name-section span h3');
let h5Tag = document.querySelector('div.user-name-section h5');

let tbody = document.querySelector('.quiz-history-section tbody');


window.addEventListener('load', () => {
    getUsersQuiz()
}) 

function getUsersQuiz(){

    var myHeaders = new Headers();

    let authToken = localStorage.getItem("x-auth-token")
    // let authToken = "abc"

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
            
            
            for(i=0; i<resultData.length; i++){
                let tr = document.createElement('tr');
    
                let idTd = document.createElement('td');
                idTd.textContent = resultData[i].id;
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
