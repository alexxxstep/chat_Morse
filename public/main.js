const socket = io();

// check Connection
socket.on('connect', () => {
  console.log('Connected to server', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server', socket.id);
});

// main elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const sendContainer = document.getElementById('send-container');
const messageContainer = document.getElementById('message-container');

//authentication
const nameInput = document.getElementById('name-input');
let userName = '';

sendContainer.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = userName + ': ' + messageInput.value;
  socket.emit('chat message', message);
  messageInput.value = '';
});

nameInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    userName = nameInput.value;
    nameInput.style.display = 'none';
    sendContainer.style.display = '';
  }
});

// listen each message and add it to the socket
socket.on('chat message', (message) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
});
