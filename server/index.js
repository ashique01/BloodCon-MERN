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

const allowedOrigins = [
  process.env.CLIENT_URL || 'https://bdbloodbox.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin/users', adminUserRoutes);

app.get('/', (req, res) => {
  res.send('Blood Donation API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
