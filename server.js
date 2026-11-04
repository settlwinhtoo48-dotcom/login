const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase PostgreSQL Database နဲ့ ချိတ်ဆက်ခြင်း
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// HTML Form ကနေ ဒေတာလက်ခံမယ့် API Route
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, email, password];
    const newUser = await pool.query(query, values);
    
    res.status(201).json({ 
      message: 'အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ', 
      user: newUser.rows[0] 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'ဆာဗာတွင် အမှားအယွင်းရှိသည်' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;