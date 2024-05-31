// // const chai = require('chai');
// // async function declaration
// async function runTests() {
//     const chai = await import('chai');
//     const chaiHttp = require('chai-http');
//     const sinon = require('sinon');
//     const app = require('../app');
//     const s3 = require('../config/s3');
    
//     chai.use(chaiHttp);
//     const { expect } = chai;
    
//     describe('Список файлов', () => {
//       it('должен получить список файлов из S3', (done) => {
//         // Мокаем listObjectsV2 из S3
//         const s3ListStub = sinon.stub(s3, 'listObjectsV2').returns({
//           promise: () => Promise.resolve({ Contents: [{ Key: 'test-file.txt', LastModified: new Date(), Size: 1024 }] })
//         });
    
//         chai.request(app)
//           .get('/upload')
//           .end((err, res) => {
//             if (err) done(err);
//             expect(res).to.have.status(200);
//             expect(res.body).to.be.an('array');
//             s3ListStub.restore();
//             done();
//           });
//       });
//     });
        
//   }
  
//   // Вызов асинхронной функции
//   runTests().catch(err => {
//     console.error(err);
//     process.exit(1); // Выход с ошибкой
//   });
  
