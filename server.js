var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var dbConfig = require('./db');
var mongoose = require('mongoose');
var errorHandler = require('express-error-handler');
var fileParser = require('connect-multiparty')();

mongoose.connect(dbConfig.url);

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({
	secret: 'mySecretKey',
	resave: true,
	saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


var flash = require('connect-flash');
app.use(flash());


var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

app.use(express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));


if (app.get('env') === 'development') {
    app.use(errorHandler());
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.listen(3000, function(){
	console.log('I\'m Listening...');
});

module.exports = app;
