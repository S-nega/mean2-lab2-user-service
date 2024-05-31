import { expect } from 'chai';
import { MongoClient } from 'mongodb';

describe('Получение всех пользователей', () => {
  let connection;
  let db;

  before(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
    db = await connection.db('mydatabase');
    // Предварительно заполните базу данных данными
  });

  after(async () => {
    await connection.close();
  });

  it('должна вернуть всех пользователей', async () => {
    const users = await db.collection('users').find({}).toArray();
    expect(users).to.be.an('array');
    expect(users).to.have.lengthOf.at.least(1); // Предполагается, что в базе есть хотя бы один пользователь
  });
});
