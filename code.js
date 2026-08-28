const { text } = require("express");

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // this prevents page refresh

    const formData = new FormData(e.target);

    const response = await fetch("/register", {
        method: "POST",
        body: formData
    });

    const result = await response.text();

    console.log(result);
});

const form = document.querySelector(".sign-up");

form.addEventListener("submit", function () {
    const username = document.getElementById("username").value;

    localStorage.setItem("username", username);
});

const username = localStorage.getItem("username");

const greet_text = "<h1>WELCOME TO MY WEBPAGE ${username} </h1>"

document.getElementById("welcome").textContent = greet_text;