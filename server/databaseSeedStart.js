const pool = require('./db');

// Sample Data for 'burrito' table
const burritoData = [
  {
      name: "Chicken Burrito",
      size: "S",
      price: 3.00
  },
  {
      name: "Chicken Burrito",
      size: "M",
      price: 4.00
  },
  {
      name: "Chicken Burrito",
      size: "L",
      price: 5.00
  },
  {
      name: "Chicken Burrito",
      size: "XL",
      price: 6.00
  },
  {
      name: "Beef Burrito",
      size: "S",
      price: 3.00
  },
  {
      name: "Beef Burrito",
      size: "M",
      price: 4.00
  },
  {
      name: "Beef Burrito",
      size: "L",
      price: 5.00
  },
  {
      name: "Beef Burrito",
      size: "XL",
      price: 6.00
  },
  {
      name: "Bean Burrito",
      size: "S",
      price: 3.00
  },
  {
      name: "Bean Burrito",
      size: "M",
      price: 4.00
  },
  {
      name: "Bean Burrito",
      size: "L",
      price: 5.00
  },
  {
      name: "Bean Burrito",
      size: "XL",
      price: 6.00
  },
  {
      name: "Special Burrito",
      size: "S",
      price: "6.50"
  },
  {
      name: "Special Burrito",
      size: "M",
      price: 8.50
  },
  {
      name: "Special Burrito",
      size: "L",
      price: 10.50
  },
  {
      name: "Special Burrito",
      size: "XL",
      price: 12.50
  }
];

// Sample Data for 'order_item' table
const orderItemData = [
  { order_item_id: 1, order_id: 1, burrito_id: 1, quantity: 2 },
  { order_item_id: 2, order_id: 1, burrito_id: 2, quantity: 1 },
  { order_item_id: 3, order_id: 1, burrito_id: 15, quantity: 2 },
  { order_item_id: 4, order_id: 1, burrito_id: 3, quantity: 3 },
  { order_item_id: 5, order_id: 2, burrito_id: 5, quantity: 3 },
  { order_item_id: 6, order_id: 2, burrito_id: 9, quantity: 7 },
  { order_item_id: 7, order_id: 2, burrito_id: 1, quantity: 5 },
  { order_item_id: 8, order_id: 2, burrito_id: 11, quantity: 1 },
  { order_item_id: 9, order_id: 3, burrito_id: 15, quantity: 9},
  { order_item_id: 10, order_id: 3, burrito_id: 14, quantity: 5 },
  { order_item_id: 11, order_id: 3, burrito_id: 13, quantity: 10 },
  { order_item_id: 12, order_id: 3, burrito_id: 1, quantity: 1 },
  { order_item_id: 13, order_id: 4, burrito_id: 3, quantity: 2 },
  { order_item_id: 14, order_id: 4, burrito_id: 5, quantity: 6 },
  { order_item_id: 15, order_id: 4, burrito_id: 8, quantity: 3 },
  { order_item_id: 16, order_id: 4, burrito_id: 1, quantity: 9 },
  { order_item_id: 17, order_id: 5, burrito_id: 1, quantity: 1 },
  { order_item_id: 18, order_id: 5, burrito_id: 2, quantity: 1 },
  { order_item_id: 19, order_id: 5, burrito_id: 3, quantity: 1 },
  { order_item_id: 20, order_id: 5, burrito_id: 16, quantity: 1 }
];

// Sample Data for 'order_table' table
const orderTableData = [
  {
      total_cost: 46.00
  },
  {
      total_cost: 50.00
  },
  {
      total_cost: 205.00
  },
  {
      total_cost: 73.00
  },
  {
      total_cost: 24.50
  }
];

// Function to reset all tables
async function truncateAllTables(tableName1, tableName2, tableName3) {
  try {
      // Truncate the table and reset the sequence
      await pool.query(`TRUNCATE TABLE ${tableName1}, ${tableName2}, ${tableName3} RESTART IDENTITY;`);
      console.log(`${tableName1}, ${tableName2}, ${tableName3} table truncated successfully.`);
  } catch (error) {
      console.error(`Error truncating ${tableName1}, ${tableName2}, ${tableName3} table:`, error);
  }
}

// Function to seed data into a table
async function seedData(tableName, data) {
    try {
      // Insert data into the table
      const columns = Object.keys(data[0]);
      const values = data.map(row => Object.values(row));
      const varCount = columns.length;
      let placeholders = '';
      for (let i = 1; i <= varCount; i++) {
        placeholders +=`$${i},`;
      };
      placeholders = placeholders.slice(0, -1);
      let query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
      console.log('Data being seeded: ', values);
      for (let i = 0; i < values.length; i++) {
        await pool.query(query, values[i]);
      };
      console.log(`${tableName} data seeded successfully.`);
    } catch (error) {
      console.error(`Error seeding ${tableName} data:`, error);
    }
  }

// Seed data for 'burrito', 'order_item', and 'order_table'
async function seedAllData() {
  truncateAllTables('burrito', 'order_item', 'order_table')
  await seedData('burrito', burritoData);
  await seedData('order_table', orderTableData);
  await seedData('order_item', orderItemData);

  // Close the database connection pool
  await pool.end();
}

// Execute the seedAllData function
seedAllData();
