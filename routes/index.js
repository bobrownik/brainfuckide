var express = require('express');
var fs = require('fs');
var fileParser = require('connect-multiparty')();
var User = require('../models/user');
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

	router.post('/upload', fileParser, function(req, res){
  		var imageFile = req.files.image;
		cloudinary.uploader.upload(imageFile.path, function(result){
    	if (result.url) {
      		User.findOneAndUpdate({
				username: req.user.username
			}, {
			$push: {
				images: result.url
			}
			}, function(err, rslt) {
			if (err) throw err;
				cloudinary.api.resources(function(items){
					res.render('ide', { user: req.user, images: items.resources, cloudinary: cloudinary });
				});
			});
    	} else {
      	console.log('Error uploading to cloudinary: ',result);
      	res.send('did not get url');
    	}
	  	});
	});

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

	return router;
}