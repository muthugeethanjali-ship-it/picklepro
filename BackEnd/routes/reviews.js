const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// Get all reviews for a court
router.get('/:court_id', async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(full_name, avatar_url)')
    .eq('court_id', req.params.court_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add a review
router.post('/', async (req, res) => {
  const { user_id, court_id, rating, comment } = req.body;
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ user_id, court_id, rating, comment }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

module.exports = router;