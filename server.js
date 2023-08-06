const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`server on port ${PORT}`));

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

//Socket connections
let users = [];
//Socket connections
io.on('connection', onConnected);

//Socket connections
function onConnected(socket) {
  /* NEW USER*/
  socket.on('new-user', (userName) => {
    const user = {};
    user.id = socket.id;
    user.name = userName;
    user.role = 'new-user';
    user.joined = false;
    user.room = { id: socket.id, name: userName };

    const roomId = socket.id;
    socket.join(roomId);
    console.log(socket);

    users.push(user);
    // socket.broadcast.emit('user-connected', user);
    upgradeUserListClient();
  });

  /*INVITE OTHER USER */
  socket.on('join-user', (data) => {
    const { userID, roomID } = data;
    users
      .filter((user) => user.room.id === roomID)
      .map((user) => {
        user.joined = false;
        user.room = { id: user.id, name: user.name };
      });
    const userJoin = getUser(userID);
    const userOwner = getUser(socket.id);

    userJoin.room = { id: userOwner['id'], name: userOwner['name'] };
    userJoin.joined = true;
    userOwner.joined = true;

    clearMessages(roomID);

    upgradeUserListClient();
  });

  /* JOIN TO ROOM USER */
  socket.on('close-user', (roomID) => {
    users
      .filter((user) => user.room.id === roomID)
      .map((user) => {
        user.joined = false;
        user.room = { id: user.id, name: user.name };
      });

    clearMessages(roomID);
    upgradeUserListClient();
  });

  // receive message
  socket.on('send-chat-msg', (message) => {
    //send msg to other users
    const userFrom = getUser(socket.id);
    const roomID = userFrom.room.id;
    const usersRoom = users.filter((user) => user.room.id === roomID);

    if (usersRoom.length === 2) {
      const userTO = usersRoom.filter((user) => user.id !== socket.id)[0];
      console.log(userTO);

      sendMessage(userFrom, userTO, message);
    }
    upgradeUserListClient();
  });

  socket.on('disconnect', () => {
    users = users.filter((user) => user.id !== socket.id);
    upgradeUserListClient();
  });
}

function upgradeUserListClient() {
  io.emit('users-count', users);
}

function getUser(socketID) {
  const user = users.find((user) => user.id === socketID);
  return user;
}

function sendMessage(userFrom, userTo, msg) {
  io.to(userTo.room.id).emit('receive-msg', `${userFrom.name}: ${msg}`);
}

function clearMessages(roomID) {
  io.to(roomID).emit('clear-msgs');
}
