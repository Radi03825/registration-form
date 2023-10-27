let loginButton = document.getElementById("loginButton");

loginButton.addEventListener('click', onLogin);

async function onLogin(ev) {
    ev.preventDefault();

    let formData = new FormData(document.getElementById('loginForm'));

    let email = formData.get("email").trim();
    let password = formData.get("password").trim();

    if (email == "" || password == "") {
        alert("Fill all fields");
    } else {
        
        let response = await fetch('/login', {
            method: 'post', 
            body: formData
        });
    }
    
}