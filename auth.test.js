const request = require('supertest');
const app = require('./server.js');
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
  
