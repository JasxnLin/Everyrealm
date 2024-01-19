const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await db.query('SELECT * FROM order_table');
    res.json(orders.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get an order by ID
router.get('/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    // Retrieve order details from order_table using JOIN with order_item and burrito
    const orderResult = await db.query(`
      SELECT o.order_id, o.total_cost, oi.quantity, b.name, b.size, b.price
      FROM order_table o
      JOIN order_item oi ON o.order_id = oi.order_id
      JOIN burrito b ON oi.burrito_id = b.burrito_id
      WHERE o.order_id = $1
    `, [orderId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).send('Order not found');
    }

    // Sum up the total cost
    let total_cost = 0;
    const orderDetails = {
      order_id: orderResult.rows[0].order_id,
      total_cost: parseFloat(orderResult.rows[0].total_cost),
      order_items: orderResult.rows.map(item => {
        total_cost += item.price * item.quantity;
        return {
          name: item.name,
          size: item.size,
          quantity: item.quantity,
        };
      }),
    };

    // Compare the total cost from the database with the calculated total cost
    if (parseFloat(total_cost) !== orderDetails.total_cost) {
      console.error('Total cost mismatch');
      return res.status(500).send('Internal Server Error');
    }

    res.json(orderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new order
router.post('/', async (req, res) => {
  const { order } = req.body;
  //Example of a req.body to be sent
  /*{
    "order": [
      {"burrito_id": 1, "quantity": 2},
      {"burrito_id": 2, "quantity": 1},
      {"burrito_id": 3, "quantity": 3},
      {"burrito_id": 15, "quantity": 2}
    ]
  }*/

  try {
    // Insert new order into order_table
    let totalCost = 0;

    for (const { burrito_id, quantity } of order) {
      const burritoPriceResult = await db.query('SELECT price FROM burrito WHERE burrito_id = $1', [burrito_id]);

      if (burritoPriceResult.rows.length === 0) {
        return res.status(404).send(`Burrito ${burrito_id} not found`);
      }

      const burritoPrice = burritoPriceResult.rows[0].price;
      totalCost += burritoPrice * quantity;
    }

    //Insert items on an order into order_table table
    const orderResult = await db.query('INSERT INTO order_table (total_cost) VALUES ($1) RETURNING order_id', [totalCost]);
    const orderId = orderResult.rows[0].order_id;

    //Insert unique ID starting from end of table
    let maxOrderItemId = await db.query('SELECT MAX(order_item_id) FROM order_item;')
    maxOrderItemId = maxOrderItemId.rows[0].max

    //Insert items on an order into order_item table
    for (let i = 0; i < order.length; i++) {
      newId = maxOrderItemId + i + 1
      await db.query('INSERT INTO order_item (order_item_id, order_id, burrito_id, quantity) VALUES ($1, $2, $3, $4)', [newId, orderId, order[i].burrito_id, order[i].quantity]);
    }
    
    res.send('Order has been added successfully!')
  }catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    // Delete order items
    const deleteOrderItemsResult = await db.query('DELETE FROM order_item WHERE order_id = $1 RETURNING *', [orderId]);
    const deletedOrderItemsCount = deleteOrderItemsResult.rows.length;

    // Delete order from order_table
    const deleteOrderResult = await db.query('DELETE FROM order_table WHERE order_id = $1 RETURNING *', [orderId]);
    const deletedOrderCount = deleteOrderResult.rows.length;

    // No orders found with the specified order_id
    if (deletedOrderItemsCount === 0 && deletedOrderCount === 0) {
      return res.status(404).send('No orders found with that specific order number');
    }

    res.status(200).send('Order deleted successfully' );
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
