const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all burritos
router.get('/', async (req, res) => {
  try {
    const burritos = await db.query('SELECT * FROM burrito');
    res.json(burritos.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a burrito by ID
router.get('/:id', async (req, res) => {
  const burritoId = req.params.id;
  try {
    const burrito = await db.query('SELECT * FROM burrito WHERE burrito_id = $1', [burritoId]);
    if (burrito.rows.length === 0) {
      res.status(404).send('Burrito not found');
    } else {
      res.json(burrito.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new burrito
router.post('/', async (req, res) => {
  const { name, size, price } = req.body;

  try {
    // Check if a burrito with the same name, size, and price already exists
    const existingBurrito = await db.query('SELECT * FROM burrito WHERE name = $1 AND size = $2 AND price = $3', [name, size, price]);
    if (existingBurrito.rows.length > 0) {
      return res.status(409).send('Burrito with the same name, size, and price already exists');
    }

    // If no existing burrito, insert the new burrito
    const result = await db.query('INSERT INTO burrito (name, size, price) VALUES ($1, $2, $3) RETURNING *', [name, size, price]);

    if (result.rows.length > 0) {
      res.status(201).send('Burrito added successfully');
    } else {
      res.status(500).send('Failed to add burrito');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit a burrito by ID
router.put('/:id', async (req, res) => {
  const burritoId = req.params.id;
  const { name, size, price } = req.body;
  try {
    const result = await db.query('UPDATE burrito SET name = $1, size = $2, price = $3 WHERE burrito_id = $4 RETURNING *', [name, size, price, burritoId]);
    if (result.rows.length === 0) {
      res.status(404).send('Burrito not found');
    } else {
      res.status(200).send('Burrito editted successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a burrito by ID
router.delete('/:id', async (req, res) => {
  const burritoId = req.params.id;
  try {
    const result = await db.query('DELETE FROM burrito WHERE burrito_id = $1 RETURNING *', [burritoId]);
    if (result.rows.length === 0) {
      res.status(404).send('Burrito not found');
    } else {
      res.send('Burrito deleted successfully' );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
