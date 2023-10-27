let registerButton = document.getElementById("registrationButton");

registerButton.addEventListener('click', onRegister);

async function onRegister(ev) {
    ev.preventDefault();

    let formData = new FormData(document.getElementById('registerForm'));

    let email = formData.get("email").trim();
    let names = formData.get("names").trim();
    let password = formData.get("password").trim();

    if (email == "" || names == "" || password == "") {
        alert("Fill all fields");
    } else {
        
        let response = await fetch('/register', {
            method: 'post', 
            body: formData
        });
    }
    
}