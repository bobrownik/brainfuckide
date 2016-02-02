var mongoose = require('mongoose');

module.exports = mongoose.model('File', {
  name: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  content: {
    type: String,
    required: true,
    default: ''
  },
  meta: {
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    },
    Author: String
  }
});
