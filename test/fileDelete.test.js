// import { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import sinon from 'sinon';
// import app from '../app';
// import fs from 'fs';
// import s3 from '../config/s3';

// chai.use(chaiHttp);

// describe('Удаление файла', () => {
//   it('должен удалить файл из S3 и с сервера', async () => {
//     // Мокаем удаление из S3
//     const s3DeleteStub = sinon.stub(s3, 'deleteObject').returns({
//       promise: () => Promise.resolve({})
//     });

//     // Выполняем запрос на удаление файла
//     const res = await chai.request(app).delete('/upload/test-file.txt');

//     // Проверяем ответ сервера
//     expect(res).to.have.status(200);

//     // Восстанавливаем оригинальный метод deleteObject
//     s3DeleteStub.restore();
//   });
// });
