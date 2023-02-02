let signupButton = document.getElementById("signup")
let otpButton = document.getElementById("verify")
let loginButton = document.getElementById("signin")
let resendOTPButton = document.getElementById("resend-otp")
let forgotPasswordButton = document.getElementById("forgot-password")
let forgotPasswordSendOtpButton = document.getElementById("forgot-password-send-otp")
let forgotPasswordVerifyOtpButton = document.getElementById("forgot-password-verify-otp")
let forgotPasswordResendOtpButton = document.getElementById("forgot-password-resend-otp")
let resetPasswordButton = document.getElementById("reset-password")

let otpToSignin = document.getElementById("otp-to-signin")
let signupToSignin = document.getElementById("signup-to-signin")
let signinToSignup = document.getElementById("signin-to-signup")
let forgotPasswordToSignin = document.getElementById("forgot-password-to-signin")
let forgotPasswordOtpToSignin = document.getElementById("forgot-password-otp-to-signin")
let resetPasswordToSignin = document.getElementById("reset-password-to-signin")

let signupSection = document.getElementById("signup-section")
let signinSection = document.getElementById("signin-section")
let otpSection = document.getElementById("otp-section")
let forgotPasswordSection = document.getElementById("forgot-password-section")
let forgotPasswordOTPSection = document.getElementById("forgot-password-otp-section")
let resetPasswordSection = document.getElementById("reset-password-section")


function checkAllFields(){
    const firstname = document.getElementById("firstname").value;
    if (!firstname) {
        alert("First name field is required.");
        return false;
    }

    const lastname = document.getElementById("lastname").value;
    if (!lastname) {
        alert("Last name field is required.");
        return false;
    }

    const username = document.getElementById("username").value;
    if (!username) {
        alert("Username field is required.");
        return false;
    }

    const email = document.getElementById("email").value;
    if (!email) {
        alert("Email field is required.");
        return false;
    }

    const password = document.getElementById("pass").value;
    if (!password) {
        alert("Password field is required.");
        return false;
    }

    return true
}

function checkOTPField(){
    const otp = document.getElementById("your_otp").value;
    if (!otp) {
        alert("OTP field is required.");
        return false;
    }

    return true
}

function checkLoginField(){
    const email = document.getElementById("your_email").value;
    if (!email) {
        alert("Email field is required.");
        return false;
    }
    
    const password = document.getElementById("your_pass").value;
    if (!password) {
        alert("Password field is required.");
        return false;
    }
    

    return true
}

function checkForgotPasswordField(){
    const email = document.getElementById("my_email").value
    if(!email){
        alert("Email field is required")
        return false
    }

    return true 
}

function checkForgotPasswordOTPField(){
    const otp = document.getElementById("new_otp").value
    if(!otp){
        alert("OTP field is required")
        return false
    }

    return true 
}

function checkResetPasswordField(){
    const newPassword = document.getElementById("new-password").value
    if(!newPassword){
        alert("New Password is required")
        return false
    }

    return true
}


signupButton.addEventListener("click", () => {

    if(checkAllFields()){

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
            "firstname": document.getElementById("firstname").value,
            "lastname": document.getElementById("lastname").value,
            "username": document.getElementById("username").value,
            "email": document.getElementById("email").value,
            "password": document.getElementById("pass").value
        });
    
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        fetch("/auth/signup", requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                response = await response.json()
                throw new Error(response.message)
            }
            return response.json();
        })
        .then(result =>  {
            alert(result.message)
            localStorage.setItem("email", document.getElementById("email").value);
            signupSection.classList.toggle("invisible")
            otpSection.classList.toggle("invisible")
        })
        .catch(error => {
            alert(error)
        });
    }


})

otpButton.addEventListener('click', () => {
    if(checkOTPField()){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": localStorage.getItem("email"),
            "otp": document.getElementById("your_otp").value
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/auth/verifyOTP", requestOptions)
        .then(async response => {
            if (!response.ok) {
                response = await response.json()
                throw new Error(response.message);
            }
            return response.json();
        })
        .then(result =>{
            
            alert(result.message)
            otpSection.classList.toggle("invisible")
            signinSection.classList.toggle("invisible")
        })
        .catch(error => {
            alert(error)
        });
    }
})

loginButton.addEventListener('click', () => {
    if(checkLoginField){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": document.getElementById("your_email").value,
            "password": document.getElementById("your_pass").value
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/auth/login", requestOptions)
        .then(async response => {
            if (!response.ok) {
                response = await response.json()
                throw new Error(response.message);
            }
            return response.json();
        })
        .then(result =>{
            
            localStorage.setItem("x-auth-token", result.token)
            localStorage.setItem("user-data", result.data)

            window.location.href = "/home"
        })
        .catch(error => {
            alert(error)
        });
    }
})

resendOTPButton.addEventListener('click', () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "email": localStorage.getItem("email")
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("/auth/resendOTP", requestOptions)
    .then(async response => {
        if (!response.ok) {
            response = await response.json()
            throw new Error(response.message);
        }
        return response.json();
    })
    .then(result =>{
        
        alert(result.message)
    })
    .catch(error => {
        alert(error)
    });
})

forgotPasswordButton.addEventListener('click', () => {
    signinSection.classList.toggle('invisible')
    forgotPasswordSection.classList.toggle('invisible')
})

forgotPasswordSendOtpButton.addEventListener('click', () => {

    if(checkForgotPasswordField()){

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
            "email": document.getElementById("my_email").value
        });
    
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        fetch("/auth/resendOTP", requestOptions)
        .then(async response => {
            if (!response.ok) {
                response = await response.json()
                throw new Error(response.message);
            }
            return response.json();
        })
        .then(result =>{
            alert(result.message)
            localStorage.setItem("email", document.getElementById("my_email").value);
            forgotPasswordSection.classList.toggle('invisible')
            forgotPasswordOTPSection.classList.toggle('invisible')
        })
        .catch(error => {
            alert(error)
        });
    }

})

forgotPasswordVerifyOtpButton.addEventListener('click', () => {
    if(checkForgotPasswordOTPField()){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": localStorage.getItem("email"),
            "otp": document.getElementById("new_otp").value
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/auth/verifyOTP", requestOptions)
        .then(async response => {
            if (!response.ok) {
                response = await response.json()
                throw new Error(response.message);
            }
            return response.json();
        })
        .then(result =>{
            alert(result.message)
            forgotPasswordOTPSection.classList.toggle("invisible")
            resetPasswordSection.classList.toggle("invisible")
        })
        .catch(error => {
            alert(error)
        });
    }
})

forgotPasswordResendOtpButton.addEventListener('click', () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "email": localStorage.getItem("email")
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("/auth/resendOTP", requestOptions)
    .then(async response => {
        if (!response.ok) {
            response = await response.json()
            throw new Error(response.message);
        }
        return response.json();
    })
    .then(result =>{
        
        alert(result.message)
    })
    .catch(error => {
        alert(error)
    });
})

resetPasswordButton.addEventListener('click', () => {
    if(checkResetPasswordField()){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": localStorage.getItem("email"),
            "newPassword": document.getElementById("new-password").value
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/auth/resetPassword", requestOptions)
        .then(async response => {
            if (!response.ok) {
                response = await response.json()
                throw new Error(response.message);
            }
            return response.json();
        })
        .then(result =>{
            alert(result.message)
            resetPasswordSection.classList.toggle("invisible")
            signinSection.classList.toggle("invisible")
        })
        .catch(error => {
            alert(error)
        });
    }
})




otpToSignin.addEventListener('click', () => {
    signinSection.classList.toggle("invisible")
    otpSection.classList.toggle("invisible")
})

signinToSignup.addEventListener('click', () => {
    signinSection.classList.toggle("invisible")
    signupSection.classList.toggle("invisible")
})

signupToSignin.addEventListener('click', () => {
    signinSection.classList.toggle("invisible")
    signupSection.classList.toggle("invisible")
})

forgotPasswordToSignin.addEventListener('click', () => {
    forgotPasswordSection.classList.toggle("invisible")
    signinSection.classList.toggle("invisible")
})

forgotPasswordOtpToSignin.addEventListener('click', () => {
    forgotPasswordOTPSection.classList.toggle("invisible")
    signinSection.classList.toggle("invisible")
})

resetPasswordToSignin.addEventListener('click', () => {
    resetPasswordSection.classList.toggle("invisible")
    signinSection.classList.toggle("invisible")
})

