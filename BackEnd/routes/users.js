const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// Get user profile
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'User not found' });
  res.json(data);
});

// Create user profile
router.post('/', async (req, res) => {
  const { email, full_name, phone } = req.body;
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, full_name, phone }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Update user profile
router.put('/:id', async (req, res) => {
  const { full_name, phone, avatar_url } = req.body;
  const { data, error } = await supabase
    .from('users')
    .update({ full_name, phone, avatar_url })
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

module.exports = router;