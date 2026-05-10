const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// Sign up
router.post('/signup', async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([{ 
        id: authData.user.id,
        email, 
        full_name, 
        phone 
      }])
      .select();

    if (profileError) return res.status(500).json({ error: profileError.message });

    res.status(201).json({ 
      message: 'Account created successfully!',
      user: profile[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({
      message: 'Signed in successfully!',
      token: data.session.access_token,
      user: data.user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign out
router.post('/signout', async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ message: 'Signed out successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;