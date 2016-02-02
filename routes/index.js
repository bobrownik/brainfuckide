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
		res.render('ide', {user: req.user});
	});

	router.post('/save', isAuthenticated, function(req, res){
		User.findOneAndUpdate({
			username: req.user.username
		}, {
		$set: {
			workflow: req.body.workflow
		}
		}, function(err, result) {
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
	  	});
	  	User.findOneAndUpdate({
			username: req.user.username
		}, {
		$push: {
			files: file
		}
		}, function(err, result) {
		if (err) throw err;
			res.send(result);
		});
	  	/*file.save(function(err) {
	    	if (err) throw err;
	    	user.files.push(file);
	  	});*/
	});

	router.post('/refreshcontent', function(req, res) {
  		file.findOneAndUpdate({
	    	name: req.body.name
	  	}, {
	    $set: {
      		content: req.body.content
    	}
	  	});
	});

	router.get('/filecontent', function(req, res) {
	  	File.find({
	      name: req.body.name
	    },
	    function(err, file) {
	      if (err) {
	        return res.status(500).send(err);
	      }
	      res.status(200).send(file.content);
	    });
	});

	router.post('/renamefile', function(req, res) {
  		file.findOneAndUpdate({
	    	name: req.body.name
	  	}, {
	    $set: {
      		name: req.body.name
    	}
	  	});
	});
	router.delete('/deletefile', function(req, res) {
		File.findOne({name: req.body.name}, function(err, result){
			File.remove({
			    _id: result._id
			  }, function(err) {
			    var head = err ? 500 : 200,
			      message = head == 500 ? 'Error' : 'OK';
			    res.status(head).send(message);
			  });
			});
		});

	return router;
}