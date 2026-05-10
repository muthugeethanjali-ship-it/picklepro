const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// Get all bookings for a user
router.get('/user/:user_id', async (req, res) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, courts(*)')
    .eq('user_id', req.params.user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get available slots for a court on a date
router.get('/availability/:court_id', async (req, res) => {
  const { date } = req.query;
  const { data, error } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('court_id', req.params.court_id)
    .eq('date', date);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a booking
router.post('/', async (req, res) => {
  const { user_id, court_id, date, start_time, end_time, total_price } = req.body;
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ user_id, court_id, date, start_time, end_time, total_price }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Cancel a booking
router.put('/:id/cancel', async (req, res) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

module.exports = router;