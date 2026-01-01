// Elements
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages-container');
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const newChatBtn = document.querySelector('.new-chat-btn');

// State
let isGenerating = false;

// Auto-resize textarea
chatInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';

    // Enable/disable send button
    if (this.value.trim().length > 0) {
        sendBtn.removeAttribute('disabled');
    } else {
        sendBtn.setAttribute('disabled', 'true');
    }
});

// Send Message
async function handleSend() {
    const text = chatInput.value.trim();
    if (!text || isGenerating) return;

    // 1. Add User Message
    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';
    sendBtn.setAttribute('disabled', 'true');
    isGenerating = true;

    // 2. Show Typing Indicator
    const typingId = addTypingIndicator();
    scrollToBottom();

    // 3. Call API
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }) // Send history context if needed
        });

        const data = await response.json();

        // 4. Remove Typing & Add AI Response
        removeMessage(typingId);

        if (data.reply) {
            typeWriterResponse(data.reply);
        } else {
            addMessage("I'm having trouble connecting right now.", 'ai');
            isGenerating = false;
        }

    } catch (err) {
        removeMessage(typingId);
        addMessage("Network error. Please try again.", 'ai');
        isGenerating = false;
    }
}

// UI Helpers
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;

    const avatarIcon = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    div.innerHTML = `
        <div class="message-avatar">
            ${avatarIcon}
        </div>
        <div class="message-content">
            <p>${formatText(text)}</p>
        </div>
    `;

    messagesContainer.appendChild(div);

    // Animate In
    gsap.to(div, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });

    return div;
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'message ai-message';
    div.id = id;
    div.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content">
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(div);
    gsap.to(div, { opacity: 1, duration: 0.3 });
    return id;
}

function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Simulate Streaming/Typewriter effect
function typeWriterResponse(text) {
    const div = document.createElement('div');
    div.className = 'message ai-message';
    div.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content"><p></p></div>
    `;
    messagesContainer.appendChild(div);
    gsap.to(div, { opacity: 1, duration: 0.3 });

    const p = div.querySelector('p');
    let i = 0;

    const interval = setInterval(() => {
        p.innerHTML += text.charAt(i);
        i++;
        scrollToBottom();

        if (i >= text.length) {
            clearInterval(interval);
            isGenerating = false;
        }
    }, 15); // Speed of typing
}

function formatText(text) {
    // Simple sanitization and line break handling
    return text.replace(/\n/g, '<br>');
}

// Event Listeners
sendBtn.addEventListener('click', handleSend);

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

newChatBtn.addEventListener('click', () => {
    messagesContainer.innerHTML = `
        <div class="message ai-message" style="opacity: 1;">
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content"><p>Hello! I'm your AI assistant. How can I help you create something amazing today?</p></div>
        </div>
    `;
    if (window.innerWidth <= 768) sidebar.classList.remove('open');
});

// Mobile & Theme
mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});
