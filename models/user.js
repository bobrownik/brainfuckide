var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    username: String,
    password: String,
    filename: {type: Array, 'default': []},
    fileсontent: {type: Array, 'default': []},
    email: String,
    firstName: String,
    lastName: String
});