var mongoose = require('mongoose');

module.exports = mongoose.model('File', {
  name: {
    type: String
  },
  content: {
    type: String,
    default: ''
  },
  username: {
    type: String
  }
});
