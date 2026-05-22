import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// ================= FIREBASE =================

const firebaseConfig = {

    apiKey:
        "AIzaSyCSZqCOnXri1hDnk9JOKDFHbPUWkgJND0c",

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

            let name =
                document.getElementById("name")
                .value.trim();

            let email =
                document.getElementById("email")
                .value.trim();

            let password =
                document.getElementById("password")
                .value.trim();

            let age =
                document.getElementById("age")
                .value.trim();

            let phone =
                document.getElementById("phone")
                .value.trim();

            let profession =
                document.getElementById("profession")
                .value;

            let country =
                document.getElementById("country")
                .value.trim();

            let monthlyIncome =
                document.getElementById("monthlyIncome")
                .value.trim();

            let goal =
                document.getElementById("goal")
                .value.trim();

            let terms =
                document.getElementById("terms")
                .checked;

            let gender =
                document.querySelector(
                    'input[name="gender"]:checked'
                );

            // ===== VALIDATION =====

            if (
                name === "" ||
                email === "" ||
                password === "" ||
                age === "" ||
                phone === "" ||
                country === "" ||
                monthlyIncome === "" ||
                goal === ""
            ) {

                alert("Please fill all fields");

                return;
            }

            if (!gender) {

                alert("Please select gender");

                return;
            }

            if (!terms) {

                alert("Please accept terms and conditions");

                return;
            }

            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters"
                );

                return;
            }

            try {

                // CREATE ACCOUNT

                let userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                let user =
                    userCredential.user;

                // SAVE EXTRA USER INFO

                let profileData = {

                    uid: user.uid,

                    name: name,

                    email: email,

                    age: age,

                    phone: phone,

                    gender: gender.value,

                    profession: profession,

                    country: country,

                    monthlyIncome: monthlyIncome,

                    financialGoal: goal
                };

                localStorage.setItem(
                    email + "_profile",
                    JSON.stringify(profileData)
                );

                alert(
                    "Registration Successful"
                );

               window.location.href =
    "./index.html";
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
                .value.trim();

            let password =
                document.getElementById("loginPassword")
                .value.trim();

            let rememberMe =
                document.getElementById("rememberMe")
                .checked;

            if (
                email === "" ||
                password === ""
            ) {

                alert("Please fill all fields");

                return;
            }

            try {

                // REMEMBER ME

                if (rememberMe) {

                    await setPersistence(
                        auth,
                        browserLocalPersistence
                    );
                }

                else {

                    await setPersistence(
                        auth,
                        browserSessionPersistence
                    );
                }

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                alert("Login Successful");

                window.location.href =
    "./home_page.html";
            }

            catch (error) {

                alert(error.message);
            }
        }
    );
}


// ================= LOGOUT =================

window.logout = async function () {

    try {

        await signOut(auth);

        alert("Logged Out Successfully");

       window.location.href =
    "./index.html";
    }

    catch (error) {

        alert(error.message);
    }
};


// ================= SHOW PASSWORD =================

let showPassword =
    document.getElementById("showPassword");

if (showPassword) {

    showPassword.addEventListener(
        "change",
        function () {

            let password =
                document.getElementById(
                    "loginPassword"
                );

            if (this.checked) {

                password.type = "text";
            }

            else {

                password.type = "password";
            }
        }
    );
}
