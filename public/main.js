const socket = io();

// main elements
const userNameAuth = document.getElementById('user-name-auth');
const chatTitle = document.getElementById('chat-title');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messageContainer = document.getElementById('message-container');
const usersContainer = document.getElementById('users-container');
const chatContainer = document.getElementById('chat-container');

let socketID;
let userName = '';
let roomID = '';
const currentUser = undefined;

//authentication
const nameInput = document.getElementById('name-input');

//receive from server information
// listen each message and add it to the socket

socket.on('users-count', (data) => {
  upgradeUserList(data);
});

socket.on('receive-msg', (message) => {
  appendMessage(message);
});

socket.on('invitation', (userInitiator) => {
  appendMessage(`*** ${userInitiator} invite to begin chat`);
});

socket.on('set-title', (user1, user2) => {
  chatTitle.innerText = `Chat: ${user1} <--> ${user2}`;
});

socket.on('clear-msgs', () => {
  messageContainer.innerHTML = '';
});

/* UPGRADE USERS LIST */
function upgradeUserList(users) {
  socketID = socket.id;

  usersContainer.innerHTML = '';
  let currentUser = users.find((user) => user.id === socketID);
  let roomID = currentUser.room.id;

  /* ADD USERS OF ROOM */
  users
    .filter((user) => user.id !== socketID)
    .map((user) => {
      const userElement = document.createElement('div');
      userElement.classList.add('user-item');
      userElement.innerText = `${user.name}`;

      if (user.room.id === roomID) {
        if (user.joined) {
          userElement.classList.add('user-joined');
        }
        userElement.addEventListener('click', () => {
          socket.emit('close-user', roomID);
        });
        usersContainer.append(userElement);
      }

      if (!user.joined && user.room.id !== roomID && !user.invitedUserID) {
        userElement.addEventListener('click', () => {
          const params = { userID: user.id, roomID: roomID };
          // socket.emit('join-user', params);
          socket.emit('invite-user', params);
        });
        usersContainer.append(userElement);
      }

      if (user.invitedUserID === socketID) {
        userElement.classList.add('user-invite');
        userElement.innerText = `${user.name} - accept`;
        userElement.addEventListener('click', () => {
          socket.emit('join-user', user.id);
        });
        usersContainer.append(userElement);
      }
    });
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (messageInput.value) {
    const message = messageInput.value;
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
messageInput.addEventListener('keypress', function (event) {
  const char = event.key;
  if (char !== '.' && char !== '-' && char !== ' ' && char !== 'Enter') {
    event.preventDefault();
  }
});

//Input name new user
nameInput.addEventListener('keyup', (e) => {
  e.preventDefault();
  if (e.key === 'Enter') {
    userName = nameInput.value;
    nameInput.style.display = 'none';
    userNameAuth.style.display = '';
    userNameAuth.innerHTML = `User: ${userName}`;
    // nameInput.value = '';
    socket.emit('new-user', userName);
    chatContainer.style.display = '';

    messageInput.focus();
    appendMessage(`Wellcome, ${userName}! You joined`);
  }
});
