import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import startupRoutes from './routes/startups.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
import authRoutes from './routes/auth.js';
import matchRoutes from './routes/matches.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';
import User from './models/User.js';
import Startup from './models/Startup.js';

config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

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
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      const mongod = await MongoMemoryServer.create({ instance: { launchTimeout: 30000 } });
      mongoUri = mongod.getUri();
      console.log('Using in-memory MongoDB (dev mode)');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    // Seed admin user if none exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hash = await bcrypt.hash('admin123', 12);
      await User.create({ name: 'Admin', email: 'admin@elevatex.com', passwordHash: hash, role: 'admin', verified: true });
      console.log('Admin user seeded: admin@elevatex.com / admin123');
    }

    // Seed demo data if no startups exist (dev mode only)
    const startupCount = await Startup.countDocuments();
    if (startupCount === 0) {
      const hash = await bcrypt.hash('demo123', 12);
      let demoFounder = await User.findOne({ email: 'demo@elevatex.com' });
      if (!demoFounder) {
        demoFounder = await User.create({ name: 'Alex Rivera', email: 'demo@elevatex.com', passwordHash: hash, role: 'founder', bio: 'Serial entrepreneur, Y-Combinator alum', headline: 'CEO @ NeuralPay', company: 'NeuralPay', verified: true });
      }
      const sampleStartups = [
        { name: 'NeuralPay', tagline: 'AI-powered payment fraud detection for SMBs', industry: 'FinTech', stage: 'Seed', askAmount: '2M', equity: '10%', traction: '15K users', description: 'NeuralPay uses advanced machine learning to detect payment fraud in real-time. Our models reduce false positives by 80% compared to legacy systems, saving small businesses millions annually.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { name: 'GreenGrid', tagline: 'Smart energy management for sustainable buildings', industry: 'CleanTech', stage: 'Pre-seed', askAmount: '500K', equity: '8%', traction: '50 buildings', description: 'GreenGrid provides AI-driven energy optimization for commercial buildings. Our IoT sensors and ML algorithms reduce energy consumption by up to 35%, cutting costs and carbon footprints.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { name: 'EduSpark', tagline: 'Personalized micro-learning for Gen Z professionals', industry: 'EdTech', stage: 'Series A', askAmount: '5M', equity: '12%', traction: '200K MAU', description: 'EduSpark delivers bite-sized learning experiences tailored to individual career goals. Our platform combines gamification with AI to create engaging professional development content.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { name: 'MedScan AI', tagline: 'Early disease detection through medical imaging', industry: 'HealthTech', stage: 'Seed', askAmount: '3M', equity: '10%', traction: '12 hospitals', description: 'MedScan AI assists radiologists by detecting anomalies in medical images with 98.5% accuracy. Our FDA-pending technology reduces diagnosis time from days to minutes.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { name: 'CloudForge', tagline: 'No-code backend builder for SaaS products', industry: 'SaaS', stage: 'Seed', askAmount: '1.5M', equity: '9%', traction: '3K developers', description: 'CloudForge lets non-technical founders build production-grade backends in minutes. Drag-and-drop APIs, auto-scaling databases, and built-in auth — ship your SaaS 10x faster.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { name: 'QuantumLeap', tagline: 'Quantum computing simplified for enterprises', industry: 'DeepTech', stage: 'Series A', askAmount: '8M', equity: '15%', traction: '5 enterprise clients', description: 'QuantumLeap provides a cloud platform that makes quantum computing accessible to enterprise developers. Solve complex optimization problems without PhD-level quantum physics knowledge.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { name: 'SynthMind', tagline: 'Autonomous AI agents for enterprise workflows', industry: 'AI/ML', stage: 'Pre-seed', askAmount: '1M', equity: '7%', traction: '500 beta users', description: 'SynthMind builds autonomous AI agents that handle complex enterprise workflows end-to-end. From data processing to report generation, automate hours of work into minutes.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { name: 'ChainVault', tagline: 'Institutional-grade DeFi portfolio management', industry: 'Web3', stage: 'Seed', askAmount: '4M', equity: '11%', traction: '$50M TVL', description: 'ChainVault provides institutional investors with sophisticated DeFi yield strategies, risk management, and regulatory compliance tools — all in one secure platform.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      ];

      for (const s of sampleStartups) {
        await Startup.create({
          ...s,
          founder: { userId: demoFounder._id, name: demoFounder.name, title: 'CEO', bio: demoFounder.bio },
          team: [{ name: demoFounder.name, role: 'CEO' }],
          status: 'approved',
          reviewedAt: new Date(),
        });
      }
      console.log(`Seeded ${sampleStartups.length} demo startups (approved)`);
    }

    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Server error:', err);
    process.exit(1);
  }
}

start();
