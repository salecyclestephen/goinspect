const express 	= require('express');
const router 	= express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get('/', function(req, res) {
	res.render('home');
});

// REGISTER PAGE
router.get('/register', function(req, res) {
	res.render('register');
});

// POST REGISTER HANDLING
router.post('/register', function(req, res) {

	// password is added outside the new user as User.register will hash the password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user)  {
		if (err) {
			console.log('something went wrong register ' + err);
			res.render('register');
		}

		// no error - user created - log the user in - take care of the session, run the serialize method above
		// 'local' stratergy is the user logging in direct to the website not facebook, so local
		passport.authenticate('local')(req, res, function() {
			res.redirect('/inspections');
		})
	})
});


// LOGIN HANDLING VIA POST REQUEST
// inside the app.post not the callback - this is called middleware (ran instantly) 
// sit between the beginning of the route and the call back - hence middleware

// compare hashed input with the one in the database
router.post('/login', passport.authenticate('local',  {
		successRedirect: '/inspections',
		failureRedirect: '/login'
	}), function(req, res) {
});

router.get('/register', function(req, res) {
	res.render('register');
});

router.get('/inspections', function(req, res) {
	res.render('inspections');
});

module.exports = router;