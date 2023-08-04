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

io.on('connection', onConnected);

function onConnected(socket) {
  console.log('connected', socket.id);
  activeUsers.add(socket.id);

  //io.emit('clients__total', activeUsers.size);

  // receive message
  socket.on('chat message', (message) => {
    console.log('Message received: ' + message);

    io.emit('chat message', message);
  });

  // Broadcast the message to all connected clients

  socket.on('disconnect', (socket) => {
    console.log('Socket disconnected', socket.id);
    activeUsers.delete(socket.id);
    io.emit('clients__total', activeUsers.size);
  });
}
