const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// Get all courts (with optional city filter)
router.get('/', async (req, res) => {
  const { city } = req.query;
  let query = supabase.from('courts').select('*');
  if (city) query = query.ilike('city', `%${city}%`);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get single court
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('courts')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Court not found' });
  res.json(data);
});

// Add a court
router.post('/', async (req, res) => {
  const { name, address, city, state, zip, latitude, longitude, price_per_hour, amenities } = req.body;
  const { data, error } = await supabase
    .from('courts')
    .insert([{ name, address, city, state, zip, latitude, longitude, price_per_hour, amenities }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

module.exports = router;