const loginForm = document.querySelector(".form-container");
loginForm.addEventListener("submit", sendForm);

async function sendForm(event){
    event.preventDefault();

    let formData = new FormData(loginForm);
    let data = Object.fromEntries(formData);
    let jsonData = JSON.stringify(data);

    console.log("JSON Data:", jsonData);

    try {
        const response = await fetch('http://localhost:5678/api/users/login',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: jsonData
        })

        const result = await response.json();

        if(response.ok) {
            // Enregistre le token dans le local storage
            localStorage.setItem('token', result.token);
            document.location.href="index.html"; 
        }
        
        else {
            console.error("mauvais identifiants");
        } 
    }
    catch (error) {
        window.alert("Erreur dans l’identifiant ou le mot de passe");
    }
}