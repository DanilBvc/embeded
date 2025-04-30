const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./routes/api');
const setupSocketHandlers = require('./socket/handlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

setupSocketHandlers(io);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

