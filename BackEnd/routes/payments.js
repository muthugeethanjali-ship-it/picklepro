const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../db/supabase');

// Create a payment intent for a booking
router.post('/create-payment-intent', async (req, res) => {
  const { amount, booking_id } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'usd',
      metadata: { booking_id }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment and update booking
router.post('/confirm', async (req, res) => {
  const { booking_id, payment_intent_id } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === 'succeeded') {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          stripe_payment_id: payment_intent_id
        })
        .eq('id', booking_id)
        .select();

      if (error) return res.status(500).json({ error: error.message });
      res.json({ success: true, booking: data[0] });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;