var config = {
    apiKey: "AIzaSyDrLMma3AOYbDyiSw6pGUWbG-vrW7eEkSI",
    authDomain: "laboratoriob5v2.firebaseapp.com",
    projectId: "laboratoriob5v2",
    storageBucket: "laboratoriob5v2.appspot.com",
    messagingSenderId: "183463752152",
    appId: "1:183463752152:web:c8450f9bb2c475bc2802ad"
};

firebase.initializeApp(config);

document.getElementById("loginButton").addEventListener("click", function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user) {
            // Usuario autenticado con éxito
            console.log("Usuario autenticado:", user);
            console.log("El usuario ha iniciado sesión con éxito.");

            // Redirige al usuario a index.html (ajusta la ruta según tu estructura de carpetas)
            window.location.href = "Admin.html";
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Error de autenticación:", errorCode, errorMessage);
            // Muestra un mensaje de error al usuario si lo deseas
        });
});

