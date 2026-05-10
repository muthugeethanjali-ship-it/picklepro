const express = require('express');
const cors = require('cors');
require('dotenv').config();

const courtsRouter = require('./routes/courts');
const bookingsRouter = require('./routes/bookings');
const usersRouter = require('./routes/users');
const reviewsRouter = require('./routes/reviews');
const paymentsRouter = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/courts', courtsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/payments', paymentsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'PicklePro API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});