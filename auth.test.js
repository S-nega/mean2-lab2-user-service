const request = require('supertest');
const app = require('./server.js');

// describe('POST /api/users/auth', () => {
//     it('should log in a user with correct credentials', async () => {
//         const response = await request(app)
//             .post('/api/users/auth')
//             .send({ email: 'snezhana.golovko@gmail.com', password: 'MyS1ste^^' });

//         expect(response.status).toBe(200);
//         expect(response.body.message).toBe('Logged in successfully');
//         expect(response.body.token).toBeDefined();
//         expect(response.body.currentUserId).toBeDefined();
//     });

//     it('should return 500 with incorrect data', async () => {
//         const response = await request(app)
//             .post('/api/users/auth')
//             .send({ email: 'invalid@example.com', password: 'wrongpassword' });

//         expect(response.status).toBe(500);
//         expect(response.body.message).toBe('Incorrect data');
//     });
// });
test('successful authentication', async () => {
    // Создаем тестового пользователя
    await createUser({ email: 'test@example.com', password: 'password' });
  
    // Отправляем запрос на авторизацию
    const response = await request(app)
      .post('/api/users/auth')
      .send({ email: 'test@example.com', password: 'password' });
  
    // Проверяем, что в ответе приходит статус 200 и токен доступа
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  
    // Удаляем тестового пользователя из базы данных
    await deleteUser('test@example.com');
  });
  
