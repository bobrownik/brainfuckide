var express = require('express');
var fs = require('fs');
var fileParser = require('connect-multiparty')();
var User = require('../models/user');
var File = require('../models/file');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(passport){
	router.get('/', function(req, res) {
		res.render('index', { message: req.flash('message') });
	});


	router.post('/login', passport.authenticate('login', {
		successRedirect: '/ide',
		failureRedirect: '/',
		failureFlash : true
	}));

	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});


	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/ide',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	router.get('/ide', isAuthenticated, function(req, res, next){
		File.find({username: req.user.username}, function(err, result){
			if (err) throw err;
			console.log(result);
			res.render('ide', {user: req.user, files: result});
		});
	});

	router.post('/saveFile', isAuthenticated, function(req, res){
		var file = new File({
	    	name: req.body.name,
	    	content: req.body.content,
	    	username: req.user.username
	  	});
	  	file.save(function(err, result) {
		if (err) throw err;
			res.send(result);
		});
	});

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.post('/createfile', isAuthenticated, function(req, res, next) {
	 	var file = new File({
	    	name: req.body.name,
	    	content: '',
	    	username: req.user.username
	  	});
	  	file.save(function(err, result) {
		if (err) throw err;
			res.send(result);
		});
	});

	router.post('/refreshcontent', function(req, res) {
  		File.findOne({username: req.user.username,	name: req.body.name}, function(err, file){
  			file.content = req.body.content;
  			file.save(function(err, result){
  				if (err) throw err;
  				res.send(result);
  			});
	  	});
	});

	router.get('/filecontent', function(req, res) {
	  	File.findOne({
	  	  username: req.user.username,
	      name: req.body.name
	    },
	    function(err, result) {
	      if (err) throw err;
	      res.send(result);
	    });
	});

	router.post('/renamefile', function(req, res) {
  		File.findOne({username: req.user.username,	name: req.body.oldname}, function(err, file){
  			file.name = req.body.newname;
  			file.save(function(err, result){
  				if (err) throw err;
  				res.send(result);
  			});
	  	});
	});

	router.post('/deletefile', function(req, res) {
		console.log(req.body.name + "\n" + req.user.username);
		File.findOne({name: req.body.name, username: req.user.username}, function(err, result){
			result.remove(function(err) {
			    var head = err ? 500 : 200,
			      message = head == 500 ? 'Error' : 'OK';
			    res.status(head).send(message);
			  });
			});
		});

	return router;
}