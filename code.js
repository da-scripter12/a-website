const form = document.querySelector(".sign-up");

if (form) {
    form.addEventListener("submit", function () {
        const username = document.querySelector('[name="username"]').value;

        localStorage.setItem("username", username);
    });
}

const username = localStorage.getItem("username");
const welcome = document.getElementById("welcome");

if (welcome && username) {
    welcome.textContent = `WELCOME TO MY WEBPAGE, ${username}`;
}
