const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`server on port ${PORT}`));

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

//Socket connections
let activeUsers = new Set();

let users = [];

//Socket connections
io.on('connection', onConnected);

//Socket connections
function onConnected(socket) {
  activeUsers.add(socket.id);

  //new-user
  socket.on('new-user', (userName) => {
    const user = {};
    user.id = socket.id;
    user.name = userName;
    user.role = 'new-user';
    user.active = true;
    users.push(user);
    io.emit('users-count', users);
    socket.broadcast.emit('user-connected', user);
  });
  // receive message
  socket.on('send-chat-msg', (message) => {
    //console.log(message);
    //send msg to other users
    //io.emit('chat-message', message);
    const user = getUser(socket.id);
    socket.broadcast.emit('chat-message', { message, user });
    //io.emit('send-chat-msg', message);
  });

  socket.on('disconnect', () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit('users-count', users);
  });
}

function getUser(socketID) {
  const user = users.find((user) => user.id === socketID);
  return user;
}
