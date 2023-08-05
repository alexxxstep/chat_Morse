const socket = io();

// main elements
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messageContainer = document.getElementById('message-container');

//authentication
const nameInput = document.getElementById('name-input');
let userName = '';

//receive from server information
// listen each message and add it to the socket
socket.on('users-count', (data) => {
  console.log(data);
});
socket.on('user-connected', (user) => {
  appendMessage(`${user.name} connected`);
});
socket.on('user-disconnected', (user) => {
  appendMessage(`${user.name} disconnected`);
});

socket.on('chat-message', (data) => {
  const { message, user } = data;
  appendMessage(`${user.name}: ${message}`);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (messageInput.value) {
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-msg', message);
    messageInput.value = '';
  }
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function getMessage(messageInput) {
  return `${userName}: ${messageInput.value}`;
}

// Can input only chars from MORSE
// messageInput.addEventListener('keypress', function (event) {
//   const char = event.key;
//   if (char !== '.' && char !== '-' && char !== ' ' && char !== 'Enter') {
//     event.preventDefault();
//   }
// });

//Input name new user
nameInput.addEventListener('keyup', (e) => {
  e.preventDefault();
  if (e.key === 'Enter') {
    userName = nameInput.value;
    nameInput.style.display = 'none';
    // nameInput.value = '';
    socket.emit('new-user', userName);
    messageContainer.style.display = '';
    messageForm.style.display = '';
    messageInput.focus();
    appendMessage(`Wellcome, ${userName}! You joined`);
  }
});
