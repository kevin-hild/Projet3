
document.addEventListener('DOMContentLoaded', () => {
    
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Email:', email);
        console.log('Password:', password);

        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: email, password: password })
        })

        .then(async response => {
            if (!response.ok) { 
        }
            return response.json();
        })
        
        .then(data => {
            if (data.token) {
            // Stocker le token dans le localStorage
            localStorage.setItem('token', data.token);
            // Rediriger vers la page d'accueil en cas de succès
            window.location.href = 'index.html';
        } else {
            // Afficher un message d'erreur en cas d'échec de la connexion
            const errorMessage = document.getElementById("error-message");
            errorMessage.innerText = 'Mauvaise Email ou mot de passe';
            errorMessage.style.opacity = 1;
            }
        })
    });
});


