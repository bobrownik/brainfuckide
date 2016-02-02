var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }]
});
