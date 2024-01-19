const request = require('supertest');
const { app, server } = require('../index'); // Update the path accordingly

// Test the GET /orders route
describe('GET /api/orders', () => {
  test('should get all orders', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(response.body.length); // Update based on your data
  });
});

// Test the GET /orders/:id route
describe('GET /api/orders/:id', () => {
  test('should return a specific order by ID', async () => {
    const orderId = 1; // Assuming order with ID 1 exists
    const response = await request(app).get(`/api/orders/${orderId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('order_id', orderId);
  });

  test('should return 404 if order is not found', async () => {
    const nonExistingId = 50; // Assuming order with ID 50 does not exist
    const response = await request(app).get(`/api/orders/${nonExistingId}`);
    expect(response.status).toBe(404);
  });
});
// Test the POST /orders route
describe('POST /api/orders', () => {
  test('should add a new order and return 200 status if details are valid', async () => {
    // Mock order to add
    const newOrder = {
      "order": [
        {"burrito_id": 2, "quantity": 9},
        {"burrito_id": 14, "quantity": 7},
        {"burrito_id": 6, "quantity": 5},
        {"burrito_id": 8, "quantity": 3}
      ]
    };

    const response = await request(app).post('/api/orders').send(newOrder);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Order has been added successfully!');
  });

  test('should return 404 if a burrito in the order is not found', async () => {
    const invalidOrder = {
      "order": [
        {"burrito_id": 1, "quantity": 2},
        {"burrito_id": 50, "quantity": 1} // Assuming burrito with ID 50 does not exist
      ]
    };

    const response = await request(app).post('/api/orders').send(invalidOrder);
    expect(response.status).toBe(404);
  });
});

// Test the DELETE /orders/:id route
describe('DELETE /api/orders/:id', () => {
  test('should delete a specific order by ID and return 200 status if order is found', async () => {
    const orderIdToDelete = 6; // Assuming order with ID 6 exists
    const response = await request(app).delete(`/api/orders/${orderIdToDelete}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Order deleted successfully');
  });

  test('should return 404 if order to delete is not found', async () => {
    const nonExistingId = 50; // Assuming burrito with ID 50 does not exist
    const response = await request(app).delete(`/api/orders/${nonExistingId}`);
    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  server.close(); // Close the server after all tests
});
