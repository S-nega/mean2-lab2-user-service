// async function runTests() {
//     const chai = await import('chai');
  
// const chaiHttp = require('chai-http');
// const sinon = require('sinon');
// const app = require('../app'); // Укажите правильный путь к вашему app.js или server.js
// const fs = require('fs');
// const s3 = require('../config/s3'); // Укажите правильный путь к вашей конфигурации S3

// chai.use(chaiHttp);
// const { expect } = chai;

// describe('Загрузка файла', () => {
//   it('должен загрузить файл в S3 и вернуть URL файла', (done) => {
//     // Мокаем загрузку в S3
//     const s3UploadStub = sinon.stub(s3, 'upload').returns({
//       promise: () => Promise.resolve({ Location: 'https://bucket-name.s3.amazonaws.com/file-name' })
//     });

//     chai.request(app)
//       .post('/upload')
//       .attach('file', fs.readFileSync('path/to/local/test-file.txt'), 'test-file.txt') // Укажите правильный путь к вашему тестовому файлу
//       .end((err, res) => {
//         if (err) done(err);
//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property('fileUrl');
//         s3UploadStub.restore();
//         done();
//       });
//   });

//   it('должен вернуть 400, если файл не был загружен', (done) => {
//     chai.request(app)
//       .post('/upload')
//       .end((err, res) => {
//         if (err) done(err);
//         expect(res).to.have.status(400);
//         done();
//       });
//   });
// });

//   }
//   // Вызов асинхронной функции
//   runTests().catch(err => {
//     console.error(err);
//     process.exit(1); // Выход с ошибкой
//   });

  