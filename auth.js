import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyCSZqCOnXri1hDnk9JOKDFHbPUWkgJND0c",

    authDomain:
        "expensemanagementsystem-2d18b.firebaseapp.com",

    databaseURL:
        "https://expensemanagementsystem-2d18b-default-rtdb.firebaseio.com",

    projectId:
        "expensemanagementsystem-2d18b",

    storageBucket:
        "expensemanagementsystem-2d18b.firebasestorage.app",

    messagingSenderId:
        "548622636141",

    appId:
        "1:548622636141:web:b795aab06513e7c37b9b64",

    measurementId:
        "G-BLY78WN2GW"
};

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);


// ================= REGISTER =================

let registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            let email =
                document.getElementById("email")
                .value;

            let password =
                document.getElementById("password")
                .value;

            try {

                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                alert("Registration Successful");

                window.location.href =
                    "login.html";
            }

            catch (error) {

                alert(error.message);
            }
        }
    );
}


// ================= LOGIN =================

let loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            let email =
                document.getElementById("loginEmail")
                .value;

            let password =
                document.getElementById("loginPassword")
                .value;

            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                alert("Login Successful");

                window.location.href =
                   "home_page.html";
            }

            catch (error) {

                alert(error.message);
            }
        }
    );
}


// ================= LOGOUT =================

window.logout = async function () {

    await signOut(auth);

    alert("Logged Out");

    window.location.href =
        "index.html";
};


// ================= SHOW PASSWORD =================

let showPassword =
    document.getElementById("showPassword");

if (showPassword) {

    showPassword.addEventListener(
        "change",
        function () {

            let password =
                document.getElementById("loginPassword");

            if (this.checked) {

                password.type = "text";
            }

            else {

                password.type = "password";
            }
        }
    );
}