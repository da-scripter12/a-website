const form = document.getElementById("prompt-form");
const input = document.getElementById("prompt");
const chat = document.getElementById("chat");
const welcome = document.getElementById("welcome");

// Conversation memory
const conversation = [];

function addMessage(sender, text) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;

    const name = document.createElement("div");
    name.className = "message-sender";
    name.textContent = sender === "user" ? "You" : "ByteLabs";

    const content = document.createElement("div");
    content.className = "message-content";

    if (sender === "ai") {
        const cleanMarkdown = text
            .replace(/\\([\\`*_[\]{}()#+.!-])/g, "$1")
            .replace(/(<br\s*\/?>\s*)/gi, "\n");

        const rawHtml = marked.parse(cleanMarkdown);
        content.innerHTML = DOMPurify.sanitize(rawHtml);
    } else {
        content.textContent = text;
    }

    message.appendChild(name);
    message.appendChild(content);
    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;

    // Return the message so we can remove it later
    return message;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = input.value.trim();

    if (!message) return;

    // Show user's message
    addMessage("user", message);

    // Save user message
    conversation.push({
        role: "user",
        content: message
    });

    input.value = "";
    input.disabled = true;

    if (welcome) {
        welcome.style.display = "none";
    }

    // Show thinking message and keep a reference to it
    const thinkingMessage = addMessage("ai", "Thinking...");

    try {
        const result = await fetch("/AI_web/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                conversation: conversation
            })
        });

        const rawText = await result.text();

        let data;

        try {
            data = JSON.parse(rawText);
        } catch {
            throw new Error(
                `Server returned invalid response (${result.status})`
            );
        }

        // Remove Thinking...
        thinkingMessage.remove();

        if (data.response) {
            // Save AI response
            conversation.push({
                role: "assistant",
                content: data.response
            });

            addMessage("ai", data.response);
        } else {
            addMessage(
                "ai",
                "ByteLabs error: " +
                (data.error || `Server error ${result.status}`)
            );
        }

    } catch (error) {
        console.error("ByteLabs error:", error);

        // Remove Thinking... if it still exists
        thinkingMessage.remove();

        addMessage(
            "ai",
            "Couldn't connect to ByteLabs: " + error.message
        );

    } finally {
        input.disabled = false;
        input.focus();
    }
});