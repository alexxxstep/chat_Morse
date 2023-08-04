const socket = io();

// check Connection
socket.on('connect', () => {
  console.log('Connected to server', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server', socket.id);
});

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const sendContainer = document.getElementById('send-container');

sendContainer.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  socket.emit('chat message', message);
  messageInput.value = '';
});
