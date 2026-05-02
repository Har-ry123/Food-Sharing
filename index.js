import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server as SocketIo } from 'socket.io';
import expressLayouts from 'express-ejs-layouts';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const server = http.createServer(app);
const io = new SocketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (in production, use a real database)
let users = [];
let foodItems = [];
let donations = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth attempt - Token:', token ? token.substring(0, 10) + '...' : 'none');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  // Simple token validation (in production, use JWT)
  const user = users.find(u => u.token === token);
  if (!user) {
    console.log('Invalid token provided:', token.substring(0, 10) + '...');
    console.log('Available tokens:', users.map(u => u.token.substring(0, 10) + '...'));
    return res.status(403).json({ error: 'Invalid token' });
  }

  console.log('Token validated for user:', user.username);
  req.user = user;
  next();
};

// Routes

// User registration
app.post('/api/register', (req, res) => {
  const { username, email, password, location } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password, // In production, hash this
    location,
    token: Math.random().toString(36).substr(2, 15), // Longer token
    createdAt: new Date(),
    rating: 5.0,
    donationsCount: 0,
    receivedCount: 0
  };

  users.push(newUser);
  console.log('User registered:', newUser.username, 'Token:', newUser.token);
  res.json({ user: newUser, token: newUser.token });
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log('User logged in:', user.username, 'Token:', user.token);
  res.json({ user, token: user.token });
});

// Get all food items
app.get('/api/food-items', (req, res) => {
  res.json(foodItems);
});

// Add food item
app.post('/api/food-items', authenticateToken, (req, res) => {
  const { title, description, quantity, expiryDate, location, imageUrl } = req.body;
  
  const newFoodItem = {
    id: Date.now().toString(),
    title,
    description,
    quantity,
    expiryDate,
    location,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    donorId: req.user.id,
    donorName: req.user.username,
    status: 'available',
    createdAt: new Date(),
    expiresAt: new Date(expiryDate)
  };

  foodItems.push(newFoodItem);
  
  // Notify other users about new food item
  io.emit('newFoodItem', newFoodItem);
  
  res.json(newFoodItem);
});

// Request food item
app.post('/api/food-items/:id/request', authenticateToken, (req, res) => {
  const foodItem = foodItems.find(item => item.id === req.params.id);
  
  if (!foodItem) {
    return res.status(404).json({ error: 'Food item not found' });
  }

  if (foodItem.donorId === req.user.id) {
    return res.status(400).json({ error: 'Cannot request your own food item' });
  }

  if (foodItem.status !== 'available') {
    return res.status(400).json({ error: 'Food item is no longer available' });
  }

  foodItem.status = 'requested';
  foodItem.requestedBy = req.user.id;
  foodItem.requestedByName = req.user.username;

  // Notify donor about request
  io.emit('foodItemRequested', {
    foodItem,
    requester: req.user
  });

  res.json(foodItem);
});

// Accept/Reject food request
app.post('/api/food-items/:id/respond', authenticateToken, (req, res) => {
  const { action } = req.body; // 'accept' or 'reject'
  const foodItem = foodItems.find(item => item.id === req.params.id);
  
  if (!foodItem || foodItem.donorId !== req.user.id) {
    return res.status(404).json({ error: 'Food item not found or unauthorized' });
  }

  if (action === 'accept') {
    foodItem.status = 'claimed';
    // Update user stats
    const donor = users.find(u => u.id === req.user.id);
    const requester = users.find(u => u.id === foodItem.requestedBy);
    if (donor) donor.donationsCount++;
    if (requester) requester.receivedCount++;
  } else {
    foodItem.status = 'available';
    delete foodItem.requestedBy;
    delete foodItem.requestedByName;
  }

  io.emit('foodItemResponse', foodItem);
  res.json(foodItem);
});

// Edit food item
app.put('/api/food-items/:id', authenticateToken, (req, res) => {
  const foodItem = foodItems.find(item => item.id === req.params.id);
  if (!foodItem) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  if (foodItem.donorId !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit your own food items' });
  }
  const { title, description, quantity, expiryDate, location, imageUrl } = req.body;
  foodItem.title = title || foodItem.title;
  foodItem.description = description || foodItem.description;
  foodItem.quantity = quantity || foodItem.quantity;
  foodItem.expiryDate = expiryDate || foodItem.expiryDate;
  foodItem.location = location || foodItem.location;
  foodItem.imageUrl = imageUrl || foodItem.imageUrl;
  foodItem.expiresAt = new Date(expiryDate || foodItem.expiryDate);
  io.emit('foodItemUpdated', foodItem);
  res.json(foodItem);
});

// Delete food item
app.delete('/api/food-items/:id', authenticateToken, (req, res) => {
  const index = foodItems.findIndex(item => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  const foodItem = foodItems[index];
  if (foodItem.donorId !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own food items' });
  }
  foodItems.splice(index, 1);
  io.emit('foodItemDeleted', { id: req.params.id });
  res.json({ success: true });
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  const userFoodItems = foodItems.filter(item => item.donorId === req.user.id);
  const userRequests = foodItems.filter(item => item.requestedBy === req.user.id);
  
  res.json({
    user: req.user,
    donatedItems: userFoodItems,
    requestedItems: userRequests
  });
});

// Get community stats
app.get('/api/stats', (req, res) => {
  const totalDonations = foodItems.filter(item => item.status === 'claimed').length;
  const totalUsers = users.length;
  const activeItems = foodItems.filter(item => item.status === 'available').length;
  
  res.json({
    totalDonations,
    totalUsers,
    activeItems,
    totalFoodItems: foodItems.length
  });
});

// Debug endpoints (only for local development)
app.get('/api/debug/items', (req, res) => {
  res.json({ items: foodItems });
});

app.post('/api/debug/add-sample', (req, res) => {
  const sample = {
    id: Date.now().toString(),
    title: req.body.title || 'Sample Meal',
    description: req.body.description || 'A delicious sample meal.',
    quantity: req.body.quantity || '1 pack',
    expiryDate: req.body.expiryDate || new Date(Date.now() + 24*60*60*1000).toISOString(),
    location: req.body.location || 'Test City',
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    donorId: req.body.donorId || 'debug-donor',
    donorName: req.body.donorName || 'Debug Donor',
    status: 'available',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24*60*60*1000)
  };
  foodItems.push(sample);
  io.emit('newFoodItem', sample);
  res.json(sample);
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Home page (EJS)
app.get('/', (req, res) => {
  const stats = {
    totalDonations: foodItems.filter(item => item.status === 'claimed').length,
    totalUsers: users.length,
    activeItems: foodItems.filter(item => item.status === 'available').length,
    totalFoodItems: foodItems.length
  };
  res.render('home', { title: 'Home', foodItems, stats });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve React app for all other routes (use RegExp to avoid path-to-regexp parameter parsing issues)
import fs from 'fs';

app.get(/.*/, (req, res) => {
  const distIndex = path.join(__dirname, 'dist/index.html');
  try {
    if (fs.existsSync(distIndex)) {
      return res.sendFile(distIndex);
    }
  } catch (err) {
    console.error('Error checking dist index file:', err);
  }

  // If the built frontend isn't available (dev mode), render a helpful message
  if (req.accepts('html')) {
    return res.send(`<html><head><title>SharePlate API</title></head><body><h1>SharePlate API running</h1><p>The frontend build is not present. Run the frontend dev server or build the project.</p></body></html>`);
  }

  res.status(404).json({ error: 'Frontend build not found' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SharePlate server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:5173`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
}); 

// Debug heartbeat to keep process alive for troubleshooting in this environment
setInterval(() => {
  // eslint-disable-next-line no-console
  console.log('[heartbeat] server alive');
}, 60000);

// Global error handlers to keep the server from exiting during development
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});