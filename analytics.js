import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

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

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "index.html";

        return;
    }

    let transactions =
        JSON.parse(
            localStorage.getItem(
                user.email + "_transactions"
            )
        ) || [];

    loadAnalytics(transactions);
});

function loadAnalytics(transactions) {

    let monthlyData = {};

    let yearlyData = {};

    let currentMonth =
        new Date().toLocaleString(
            "default",
            { month: "long" }
        );

    let currentYear =
        new Date().getFullYear();

    let currentMonthIncome = 0;
    let currentMonthExpense = 0;

    let currentYearIncome = 0;
    let currentYearExpense = 0;

    transactions.forEach((transaction) => {

        let date =
            new Date(transaction.date);

        let month =
            date.toLocaleString(
                "default",
                { month: "long" }
            );

        let year =
            date.getFullYear();

        if (!monthlyData[month]) {

            monthlyData[month] = {

                income: 0,
                expense: 0
            };
        }

        if (!yearlyData[year]) {

            yearlyData[year] = {

                income: 0,
                expense: 0
            };
        }

        if (transaction.type === "income") {

            monthlyData[month].income +=
                transaction.amount;

            yearlyData[year].income +=
                transaction.amount;

            if (month === currentMonth) {

                currentMonthIncome +=
                    transaction.amount;
            }

            if (year === currentYear) {

                currentYearIncome +=
                    transaction.amount;
            }
        }

        else {

            monthlyData[month].expense +=
                transaction.amount;

            yearlyData[year].expense +=
                transaction.amount;

            if (month === currentMonth) {

                currentMonthExpense +=
                    transaction.amount;
            }

            if (year === currentYear) {

                currentYearExpense +=
                    transaction.amount;
            }
        }
    });

    document.getElementById(
        "monthlyIncome"
    ).innerHTML =
        currentMonthIncome + " BDT";

    document.getElementById(
        "monthlyExpense"
    ).innerHTML =
        currentMonthExpense + " BDT";

    document.getElementById(
        "yearlyIncome"
    ).innerHTML =
        currentYearIncome + " BDT";

    document.getElementById(
        "yearlyExpense"
    ).innerHTML =
        currentYearExpense + " BDT";

    let monthlyTable =
        document.getElementById(
            "monthlyTable"
        );

    for (let month in monthlyData) {

        let income =
            monthlyData[month].income;

        let expense =
            monthlyData[month].expense;

        let balance =
            income - expense;

        monthlyTable.innerHTML += `

            <tr>

                <td>${month}</td>

                <td>${income} BDT</td>

                <td>${expense} BDT</td>

                <td>${balance} BDT</td>

            </tr>
        `;
    }

    let yearlyTable =
        document.getElementById(
            "yearlyTable"
        );

    for (let year in yearlyData) {

        let income =
            yearlyData[year].income;

        let expense =
            yearlyData[year].expense;

        let balance =
            income - expense;

        yearlyTable.innerHTML += `

            <tr>

                <td>${year}</td>

                <td>${income} BDT</td>

                <td>${expense} BDT</td>

                <td>${balance} BDT</td>

            </tr>
        `;
    }

    new Chart(

        document.getElementById(
            "monthlyChart"
        ),

        {

            type: "bar",

            data: {

                labels:
                    Object.keys(monthlyData),

                datasets: [

                    {

                        label: "Income",

                        data:
                            Object.values(monthlyData)
                            .map(data => data.income),

                        backgroundColor:
                            "#36a2eb"
                    },

                    {

                        label: "Expense",

                        data:
                            Object.values(monthlyData)
                            .map(data => data.expense),

                        backgroundColor:
                            "#ff6384"
                    }
                ]
            }
        }
    );

    new Chart(

        document.getElementById(
            "yearlyChart"
        ),

        {

            type: "line",

            data: {

                labels:
                    Object.keys(yearlyData),

                datasets: [

                    {

                        label: "Income",

                        data:
                            Object.values(yearlyData)
                            .map(data => data.income),

                        borderColor:
                            "#36a2eb",

                        fill: false
                    },

                    {

                        label: "Expense",

                        data:
                            Object.values(yearlyData)
                            .map(data => data.expense),

                        borderColor:
                            "#ff6384",

                        fill: false
                    }
                ]
            }
        }
    );
}