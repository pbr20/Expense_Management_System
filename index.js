import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
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

let transactions = [];

let budget = 0;

let currentUser = "";

let tableBody =
    document.getElementById("tableBody");

let chart;

// ================= QUOTE API =================

async function loadQuote() {

    try {

        let response =
            await fetch(
                "https://dummyjson.com/quotes/random"
            );

        let data =
            await response.json();

        document.getElementById("quote")
        .innerHTML =
            `"${data.quote}" — ${data.author}`;
    }

    catch (error) {

        document.getElementById("quote")
        .innerHTML =
            "Unable to load quote";
    }
}

loadQuote();

window.loadQuote =
    loadQuote;

// ================= AUTH CHECK =================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "login.html";
    }

    else {

        currentUser = user.email;

        transactions =
            JSON.parse(
                localStorage.getItem(
                    currentUser + "_transactions"
                )
            ) || [];

        budget =
            Number(
                localStorage.getItem(
                    currentUser + "_budget"
                )
            ) || 0;

        displayTransactions();

        updateBudgetStatus();

        updateChart();
    }
});


// ================= ADD TRANSACTION =================

function addTransaction() {

    let title =
        document.getElementById("title").value.trim();

    let amount =
        document.getElementById("amount").value;

    let type =
        document.getElementById("type").value;

    let category =
        document.getElementById("category").value;

    let date =
        document.getElementById("date").value;

    if (
        title === "" ||
        amount === "" ||
        date === ""
    ) {

        alert("Please fill all fields");

        return;
    }

    let transaction = {

        title: title,

        amount: Number(amount),

        type: type,

        category: category,

        date: date
    };

    transactions.push(transaction);

    localStorage.setItem(
        currentUser + "_transactions",
        JSON.stringify(transactions)
    );

    displayTransactions();

    updateBudgetStatus();

    updateChart();

    clearFields();
}


// ================= DISPLAY =================

function displayTransactions() {

    tableBody.innerHTML = "";

    let totalIncome = 0;

    let totalExpense = 0;

    transactions.forEach((transaction, index) => {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;
        }

        else {

            totalExpense += transaction.amount;
        }

        let row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${transaction.title}</td>

            <td>${transaction.amount} BDT</td>

            <td>${transaction.type}</td>

            <td>${transaction.category}</td>

            <td>${transaction.date}</td>

            <td>

                <button class="btn btn-danger btn-sm"
                    onclick="deleteTransaction(${index})">

                    Delete

                </button>

            </td>
        `;

        tableBody.appendChild(row);
    });

    document.getElementById("income").innerHTML =
        totalIncome + " BDT";

    document.getElementById("expense").innerHTML =
        totalExpense + " BDT";

    document.getElementById("balance").innerHTML =
        (totalIncome - totalExpense) + " BDT";
}


// ================= DELETE =================

function deleteTransaction(index) {

    transactions.splice(index, 1);

    localStorage.setItem(
        currentUser + "_transactions",
        JSON.stringify(transactions)
    );

    displayTransactions();

    updateBudgetStatus();

    updateChart();
}


// ================= CLEAR =================

function clearFields() {

    document.getElementById("title").value = "";

    document.getElementById("amount").value = "";

    document.getElementById("date").value = "";
}


// ================= SEARCH =================

function searchTransaction() {

    let searchValue =
        document.getElementById("search")
        .value
        .toLowerCase();

    let rows =
        document.querySelectorAll("tbody tr");

    rows.forEach((row) => {

        let title =
            row.children[0]
            .innerHTML
            .toLowerCase();

        if (title.includes(searchValue)) {

            row.style.display = "";
        }

        else {

            row.style.display = "none";
        }
    });
}


// ================= DARK MODE =================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");
}


// ================= BUDGET =================

function setBudget() {

    let inputBudget =
        document.getElementById("budgetInput")
        .value;

    if (inputBudget === "") {

        alert("Please enter budget");

        return;
    }

    budget =
        Number(inputBudget);

    localStorage.setItem(
        currentUser + "_budget",
        budget
    );

    updateBudgetStatus();

    document.getElementById("budgetInput")
    .value = "";

    alert("Budget Saved Successfully");
}

function updateBudgetStatus() {

    let totalExpense = 0;

    let currentDate =
        new Date();

    let currentMonth =
        currentDate.getMonth();

    let currentYear =
        currentDate.getFullYear();

    transactions.forEach((transaction) => {

        if (
            transaction.type === "expense"
        ) {

            let transactionDate =
                new Date(transaction.date);

            let transactionMonth =
                transactionDate.getMonth();

            let transactionYear =
                transactionDate.getFullYear();

            // ONLY CURRENT MONTH EXPENSE

            if (
                transactionMonth === currentMonth &&
                transactionYear === currentYear
            ) {

                totalExpense +=
                    transaction.amount;
            }
        }
    });

    let status =
        document.getElementById(
            "budgetStatus"
        );

    if (budget === 0) {

        status.innerHTML =
            "No Budget Set Yet";

        status.style.color =
            "black";

        return;
    }

    if (totalExpense > budget) {

        status.innerHTML =
            "Warning: Monthly Budget Exceeded!";

        status.style.color =
            "red";
    }

    else {

        let remaining =
            budget - totalExpense;

        status.innerHTML =
            "Remaining Monthly Budget: " +
            remaining +
            " BDT";

        status.style.color =
            "green";
    }
}
// ================= LOGOUT =================

window.logout = async function () {

    await signOut(auth);

    alert("Logged Out Successfully");

    window.location.replace("./index.html");
};
window.addTransaction =
    addTransaction;

window.deleteTransaction =
    deleteTransaction;

window.searchTransaction =
    searchTransaction;

window.toggleDarkMode =
    toggleDarkMode;

window.setBudget =
    setBudget;
