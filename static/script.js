let userName = '';
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const nameButton = document.getElementById('name-button');
const welcomeContainer = document.getElementById('welcome-container');
const typingIndicator = document.getElementById('typing-indicator');

// Handle name submission
nameButton.addEventListener('click', function() {
    submitName();
});

nameInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        submitName();
    }
});

function submitName() {
    userName = nameInput.value.trim();
    if (userName) {
        welcomeContainer.style.display = 'none';
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
        
        // Show typing indicator
        showTypingIndicator();
        
        // Generate a session ID
        window.sessionId = Date.now().toString();
        
        // Call API to start conversation
        fetch('http://127.0.0.1:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: window.sessionId,
                message: "",
                name: userName
            }),
        })
        .then(response => response.json())
        .then(data => {
            hideTypingIndicator();
            addMessage(data.response, 'bot');
        })
        .catch(error => {
            hideTypingIndicator();
            console.error('Error:', error);
            addMessage(`Nice to meet you, ${userName}! I'm here to help you with any questions about TIP's Senior High School program. Ask me anything! (Note: Backend connection failed)`, 'bot');
        });
    }
}

// Handle sending messages
sendButton.addEventListener('click', function() {
    sendMessage();
});

messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        messageInput.value = '';
        messageInput.focus();
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate response after a delay (this would be replaced with your actual chatbot backend)
        setTimeout(() => {
            hideTypingIndicator();
            handleBotResponse(message);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    
    // Add icon
    const iconElement = document.createElement('div');
    iconElement.classList.add(sender === 'bot' ? 'bot-icon' : 'user-icon');
    iconElement.textContent = sender === 'bot' ? 'T' : userName.charAt(0).toUpperCase();
    messageElement.appendChild(iconElement);
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    typingIndicator.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Simulated bot responses (replace this with your actual backend integration)
function handleBotResponse(userMessage) {
    // Generate a session ID if we don't have one yet
    if (!window.sessionId) {
        window.sessionId = Date.now().toString();
    }
    
    fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: window.sessionId,
            message: userMessage,
            name: userName
        }),
    })
    .then(response => response.json())
    .then(data => {
        addMessage(data.response, 'bot');
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage("Sorry, I'm having trouble connecting to my backend. Please try again later.", 'bot');
    });
}
