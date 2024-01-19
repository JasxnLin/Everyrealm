const express = require("express");
const app = express();
const pool = require('./db');
const burritoRoutes = require('./burritos/burritoRoutes');
const orderRoutes = require('./orders/orderRoutes');
const PORT = 1337;

app.use(express.json());

// Use burritos routes
app.use('/api/burrito', burritoRoutes);

// Use orders routes
app.use('/api/orders', orderRoutes);

const server = app.listen(PORT, () =>{
  console.log(`server has started on port ${PORT}`);
});

module.exports = { app, server };
