const request = require('supertest');
const app = require('./server.js');

describe('POST /api/users/auth', () => {
    it('should log in a user with correct credentials', async () => {
        const response = await request(app)
            .post('/api/users/auth')
            .send({ email: 'snezhana.golovko@gmail.com', password: 'MyS1ste^^' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logged in successfully');
        expect(response.body.token).toBeDefined();
        expect(response.body.currentUserId).toBeDefined();
    });

    it('should return 500 with incorrect data', async () => {
        const response = await request(app)
            .post('/api/users/auth')
            .send({ email: 'invalid@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Incorrect data');
    });
});
