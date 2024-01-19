const request = require('supertest');
const { app, server } = require('../index'); // Update the path accordingly

// Test the GET / route
describe('GET /api/burrito', () => {
  test('should get all burritos', async () => {
    const response = await request(app).get('/api/burrito');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(response.body.length); // Assuming no burritos initially, update based on your data
  });
});

// Test the GET /:id route
describe('GET /api/burrito/:id', () => {
  test('should return a specific burrito by ID', async () => {
    const burritoId = 5;
    const response = await request(app).get(`/api/burrito/${burritoId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('should return 404 if burrito is not found', async () => {
    const nonExistingId = 50;
    const response = await request(app).get(`/api/burrito/${nonExistingId}`);
    expect(response.status).toBe(404);
  });
});

// Test the POST / route
describe('POST /api/burrito', () => {
  test('should add a new burrito and return 201 status if details are valid', async () => {
    const newBurrito = {
      "name": "Super Special Burrito",
      "size": "XL",
      "price": "100"
    };

    const response = await request(app).post('/api/burrito').send(newBurrito);
    expect(response.status).toBe(201);
    expect(response.text).toBe('Burrito added successfully');
  });
  test('should return 409 if burrito with the same details already exists', async () => {
    const existingBurrito = {
      "name": "Chicken Burrito",
      "size": "S",
      "price": "3.00"
    };

    const response = await request(app).post('/api/burrito').send(existingBurrito);
    expect(response.status).toBe(409);
  });
});

//Test the PUT /:id route
describe('PUT /api/burrito/:id', () => {
  test('should update a specific burrito by ID and return 200 status if details are valid', async () => {
    const burritoId = 16;
    const updatedBurrito = {
      "name": "Updated Burrito",
      "size": "L",
      "price": "12.50"
    };

    const response = await request(app).put(`/api/burrito/${burritoId}`).send(updatedBurrito);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Burrito editted successfully');
  });

  test('should return 404 if burrito is not found', async () => {
    const nonExistingId = 50
    const response = await request(app).put(`/burritos/${nonExistingId}`).send({});
    expect(response.status).toBe(404);
  });
});

//Test the DELETE /:id route
describe('DELETE /api/burrito/:id', () => {
  test('should return 404 if burrito is not found', async () => {
    const nonExistingId = 50;
    const response = await request(app).delete(`/burrito/${nonExistingId}`);
    expect(response.status).toBe(404);
  });

  test('should delete a specific burrito by ID and return 200 status if burrito is found', async () => {
    const burritoId = 4;
    const response = await request(app).delete(`/api/burrito/${burritoId}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Burrito deleted successfully');
  });
});

afterAll(async () => {
  server.close(); // Close the server after all tests
});
