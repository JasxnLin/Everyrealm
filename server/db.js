const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'everyrealm', 
  password: 'test', //replace with your own postgres password
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
