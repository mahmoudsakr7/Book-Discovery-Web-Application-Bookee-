//Declaring create account inputs as variables 
let signUpUsername = document.getElementById('signup-username');
let signUpEmail = document.getElementById('signup-email');
let signUpPassword = document.getElementById('signup-password');
let createAccountInputs = [signUpUsername, signUpEmail, signUpPassword];

// declare login inputs as variables 
let logInUsername = document.getElementById('login-username');
let logInPassword = document.getElementById('login-password');
let logInInputs = [logInUsername, logInPassword];
let wrongPassword = document.getElementById('wrong-password');

//function responsible for reset the alert style to the default for the create account page
function resentCreateInpuyStyle() {
    for (let i = 0; i < createAccountInputs.length; i++) {
        if (createAccountInputs[i].value.trim() != "") {
            createAccountInputs[i].style.borderBottom = '1px solid #ffffff';
        }
    }
}

//function responsible for reset the alert style to the default for the login page
function resentLoginInpuyStyle() {
    for (let i = 0; i < logInInputs.length; i++) {
        if (logInInputs[i].value.trim() != "") {
            logInInputs[i].style.borderBottom = '1px solid #ffffff';
        }
    }
    wrongPassword.style.display = "none";
}

//function responsible for creating account the page take the input data and store it in the local storage 
function createAccount() {
    if (localStorage.user != null) {
        userList = JSON.parse(localStorage.getItem('user'));
    }
    else {
        userList = [];
    }
    if (signUpUsername.value.trim() != "" && signUpEmail.value.trim() != "" && signUpPassword.value.trim() != "") {
        let userData = {
            username: signUpUsername.value.toLowerCase(),
            email: signUpEmail.value.toLowerCase(),
            password: signUpPassword.value,
        }
        userList.push(userData);
        localStorage.setItem('user', JSON.stringify(userList));
    }
    else if (signUpUsername.value.trim() == "" || signUpEmail.value.trim() == "" || signUpPassword.value.trim() == "") {
        for (let i = 0; i < createAccountInputs.length; i++) {
            if (createAccountInputs[i].value.trim() == "") {
                createAccountInputs[i].style.borderBottom = '1px solid #ff0f0f';
            }
        }
    }
    return;
}

function logIn(event) {
    event.preventDefault();
    let userList = JSON.parse(localStorage.getItem('user')) || [];
    if (logInUsername != "" && logInPassword != "") {
        for (let i = 0; i < userList.length; i++) {
            if ((logInUsername.value.trim() == userList[i].username || logInUsername.value.trim() == userList[i].email)
                && logInPassword.value.trim() == userList[i].password) {
                console.log('i am here');
                window.open('home.html', "_self");
                return;

            }
            else if ((logInUsername.value.trim() != userList[i].username || logInUsername.value.trim() != userList[i].email)
                && logInPassword.value.trim() != userList[i].password) {
                for (let i = 0; i < logInInputs.length; i++) {
                    logInInputs[i].style.borderBottom = '1px solid #ff0f0f';
                }
                wrongPassword.style.display = "block";
            }
        }
    }
    else if (logInUsername == "" && logInPassword == "") {
        for (let i = 0; i < logInInputs.length; i++) {
            logInInputs[i].style.borderBottom = '1px solid #ff0f0f';
        }
    }

}

