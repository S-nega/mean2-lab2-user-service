const path = require('path');

module.exports = {
  resolve: {
    alias: {
      users: path.resolve(__dirname, '../../../models/users.js')
    }
  }
};