import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      cors: {
        origin: "*", // Replace "*" with your client URL for production
        methods: ["GET", "POST"]
      }
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('New socket connection:', socket.id);

      // Join a specific room
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
      });

      // Handle sending and broadcasting messages
      socket.on('send-message', (message) => {
        const { roomId, content } = message;
        io.to(roomId).emit('receive-message', {
          sender: socket.id,
          content,
        });
        console.log(`Message sent to room ${roomId}: ${content}`);
      });
    });
  }
  res.end();
};

export default SocketHandler;
