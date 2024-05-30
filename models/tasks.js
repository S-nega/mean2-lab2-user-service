const mongoose = require('mongoose');

// Определение схемы задачи
const tasksSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
    },
    description: { 
      type: String, 
    },
    status: {
      type: String,
    },
  }
);

// Определение модели задачи
const Tasks = mongoose.model('Tasks', tasksSchema);

module.exports = Tasks;
