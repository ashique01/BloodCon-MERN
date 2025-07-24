const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://bdbloodbox.netlify.app'
];

// ✅ CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin/users', adminUserRoutes);

app.get('/', (req, res) => {
  res.send('Blood Donation API is running...');
});

app.use(notFound);
app.use(errorHandler);

// Optional CORS error handler to send proper response
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS error: Not allowed' });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
