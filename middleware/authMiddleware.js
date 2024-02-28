const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Получаем токен из заголовка Authorization
  const token = this.userService.GetAuthToken();//in getAuthToken set this token

  console.log('authMidleware: ' + token)
  if (!token) {
    console.log('Unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Проверяем валидность токена
  jwt.verify(token, 'secret', (err, decoded) => {
    console.log("jwt.verify: " + token);
    if (err) {
        console.log( 'Invalid token');
        return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId; // Сохраняем идентификатор пользователя в запросе

    // localStorage.setItem('token', token);
    next(); // Продолжаем выполнение цепочки middleware
  });
};

