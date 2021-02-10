process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('../app');
let items = require('../fakeDb');


beforeEach(async () => {
    items.push({name: 'garlic', price: '2.59'});
    items.push({name: 'candy', price: '1.99'});
})


afterEach(async () => {
    items = [];
})


describe("GET /items", () => {
    test("Retrieves a list of items when no parameters are passed", async () => {
        const response = await request(app).get(`/items`);
        const { items } = response.body;
        expect(response.statusCode).toBe(200);
        expect(items).toHaveLength(2);
        expect(items[0]).toEqual({name: 'garlic', price: '2.59'});
    });
});

  
describe("GET /items/:name", () => {
    test("Retrieves a single item when a valid item name parameter is passed", async () => {
        const response = await request(app).get('/items/candy');
        const candy = response.body;
        expect(response.statusCode).toBe(200);
        expect(candy).toEqual({name: 'candy', price: '1.99'});
    });
    test("Responds with 404 if item name not found in fake database", async () => {
        const response = await request(app).get(`/items/0`);
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toEqual('Item not found');
    });
});

  
describe("POST /items", () => {
    test("Creates a new item when a valid grocery item is sent as JSON", async () => {
        const response = await request(app)
            .post(`/items`)
            .send({ name: "Beer", price: 12.99
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.added).toHaveProperty("name");
        expect(response.body.added).toHaveProperty("price");
        expect(response.body.added.name).toEqual("Beer");
        expect(response.body.added.price).toEqual(12.99);
    });
    test("Returns a 404 error when invalid JSON data is sent", async () => {
        const response = await request(app)
            .post(`/items`)
            .send({ name: "Beer", price: null
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toEqual('Name and price are required');
    });
});

  
describe("PATCH /items/:name", () => {
    test("Updates a single item", async () => {
        const response = await request(app)
            .patch('/items/garlic')
            .send({name: "MORE GARLIC", price: '13.50'
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.updated).toHaveProperty('name');
        expect(response.body.updated).toHaveProperty('price');
        expect(response.body.updated.name).toEqual('MORE GARLIC');
    });
    test("Responds with 404 if the item name is not in the database", async () => {
      const response = await request(app)
        .patch(`/items/stuff`)
        .send({name: "MORE GARLIC", price: '13.50'
    });
      expect(response.statusCode).toBe(404);
    });
    test("Responds with 400 if there is missing JSON data", async () => {
        const response = await request(app)
            .patch(`/items/stuff`)
            .send({name: "MORE GARLIC", price: null
    });
        expect(response.statusCode).toBe(400);
    });
});

  
describe("DELETE /items/:name", () => {
    test("Deletes a single item when a valid item name parameter is passed", async () => {
        const response = await request(app)
            .delete('/items/candy');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Deleted" });
    });
    test("Returns a 404 when an invalid name parameter is provided", async () => {
        const response = await request(app)
            .delete('/items/blah');
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toEqual('Item not found');
    });
});
