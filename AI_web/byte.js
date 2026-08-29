const form = document.getElementById("prompt-form");
const input = document.getElementById("prompt");
const chat = document.getElementById("chat");
const welcome = document.getElementById("welcome");

function addMessage(sender, text) {
    const message = document.createElement("div");

    message.className = `message ${sender}`;

    const name = document.createElement("div");
    name.className = "message-sender";
    name.textContent = sender === "user" ? "You" : "ByteLabs";

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;

    message.appendChild(name);
    message.appendChild(content);

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = input.value.trim();

    if (!message) return;

    // Immediately display what YOU typed
    addMessage("user", message);

    input.value = "";
    input.disabled = true;

    if (welcome) {
        welcome.style.display = "none";
    }

    try {
        const result = await fetch("/AI_web/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const text = await result.text();

        console.log("STATUS:", result.status);
        console.log("SERVER RESPONSE:", text);

        console.log("SERVER RESPONSE:", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            console.error("Server did not return JSON:", text);
            addMessage("ai", "Server returned an invalid response.");
            return;
        }

        if (data.response) {
            addMessage("ai", data.response);
        } else {
            addMessage("ai", data.error || "No response received.");
        }

    } catch (error) {
        console.error(error);
        addMessage("ai", "Couldn't connect to ByteLabs.");
    }

    input.disabled = false;
    input.focus();
});