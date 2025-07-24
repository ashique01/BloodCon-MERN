const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env variables
dotenv.config();

// Connect to DB
connectDB();

// Create app
const app = express();

// Allowed frontend origins
const allowedOrigins = [
  process.env.CLIENT_URL || 'https://localhost:5173',
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Preflight requests support
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Body parser middleware
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin/users', adminUserRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Blood Donation API is running...');
});

// Error middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
