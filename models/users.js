const mongoose = require('mongoose');

// Определение схемы задачи
const usersSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
    },
    age: { 
      type: Number, 
    },
    email: { 
      type: String, 
    },
    password: {
      type: String,
    },
    news:{
      type:[String],
    },
    failedLoginAttempts: {
      type: Number,
    },
    lockUntil: {
      type: Number,
    }
  }
);

// Определение модели задачи
const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
