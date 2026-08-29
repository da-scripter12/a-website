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

    addMessage("user", message);

    input.value = "";
    input.disabled = true;

    if (welcome) {
        welcome.style.display = "none";
    }

    // Show that ByteLabs is actually doing something
    addMessage("ai", "Thinking...");

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

        const data = await result.json();

        // Remove "Thinking..."
        const messages = chat.querySelectorAll(".message");
        const lastMessage = messages[messages.length - 1];

        if (
            lastMessage &&
            lastMessage.classList.contains("ai") &&
            lastMessage.querySelector(".message-content")?.textContent === "Thinking..."
        ) {
            lastMessage.remove();
        }

        if (data.response) {
            addMessage("ai", data.response);
        } else {
            addMessage("ai", "ByteLabs error: " + (data.error || "Unknown error"));
        }

    } catch (error) {
        const messages = chat.querySelectorAll(".message");
        const lastMessage = messages[messages.length - 1];

        if (
            lastMessage &&
            lastMessage.classList.contains("ai") &&
            lastMessage.querySelector(".message-content")?.textContent === "Thinking..."
        ) {
            lastMessage.remove();
        }

        console.error("ByteLabs connection error:", error);

        addMessage("ai", "Couldn't connect to ByteLabs: " + error.message);
    }