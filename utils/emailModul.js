const nodemailer = require('nodemailer');

// Создайте транспортер для отправки писем
const transporter = nodemailer.createTransport({
  service: 'mail.ru',
  auth: {
    user: 'snezhana.golovko02@mail.ru',
    pass: 'gpmaUAbiau7jZ0qZZ9kC'
  }
});

// Функция для отправки письма
async function sendEmail(email, subject, text) {
  try {
    // Отправка письма
    await transporter.sendMail({
      from: 'snezhana.golovko02@mail.ru',
      to: email,
      subject: subject,
      text: text
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendEmail };
