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