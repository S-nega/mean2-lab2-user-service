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
    }
  }
);

// Определение модели задачи
const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
