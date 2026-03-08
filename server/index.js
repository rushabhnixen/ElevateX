import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import startupRoutes from './routes/startups.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';

config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/startups', startupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user_joined', { socketId: socket.id });
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', { ...data, timestamp: new Date() });
  });

  socket.on('typing', (data) => {
    // Broadcast typing indicator to room (excluding sender)
    socket.to(data.roomId).emit('typing', { userId: data.userId, isTyping: data.isTyping });
  });

  socket.on('notification', (data) => {
    // Forward notification to a specific user's room
    if (data.targetUserId) {
      io.to(`user:${data.targetUserId}`).emit('notification', data);
    }
  });

  socket.on('join_user_room', (userId) => {
    // Join a personal notification room
    socket.join(`user:${userId}`);
  });

  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
    }
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Server error:', err);
    process.exit(1);
  }
}

start();
