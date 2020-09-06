const express 	= require('express');
const router 	= express.Router();
const passport = require("passport");
const User = require("../models/user");
const Preservation = require("../models/Preservation");

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

router.get('/login', function(req, res) {
	res.render('login');
});

// inspection options
router.get('/inspections', isLoggedIn, function(req, res) {
	res.render('inspections');
});

// preservation survey
router.get('/preservation', isLoggedIn, function(req, res) {
	res.render('preservation');
});

// save the preservation survey
router.post('/preservation', function(req, res) {
	const post = new Preservation(req.body);
 
    post.save(function(err, user) {
        if (err) {
        	console.log(err);
    	}
        return res.redirect('/index');
    });
});

// show the selected preservation survey
router.get('/preservation/:id', function(req, res) {
	Preservation.findById(req.params.id, function(err, preservation){
		if (err) {
			console.log('something went wrong show ' + err);
		} else {
			res.render('show', {preservation: preservation});
		}
	});
});

// EDIT ROUTE - combination of SHOW and UPDATE
router.get('/preservation/:id/edit', isLoggedIn, function(req, res) {
	Preservation.findById(req.params.id, function(err, preservation){
		if (err) {
			console.log('something went wrong edit route ' + err);
		} else {
			res.render('edit', {preservation: preservation});
		}
	});
});

// UPDATE ROUTE -- METHOD OVERRIDE NEEDED HERE
router.put('/preservation/:id', function(req, res) {

	Preservation.findByIdAndUpdate(req.params.id, req.body, function(err, updatedPreservation) {
		if (err) {
			console.log('something went wrong update route ' + err);
		} else {
			res.redirect('/preservation/' + req.params.id);
		}
	});
});

// DELETE (DESTROY) ROUTE
router.delete('/preservation/:id', function(req, res) {
	Preservation.findByIdAndRemove(req.params.id, function(err, updatedPreservation) {
		if (err) {
			console.log('something went wrong delete route ' + err);
		} else {
			res.redirect('/index');
		}
	});
});

// show ALL saved surveys
router.get('/index', isLoggedIn, function(req, res) {
	Preservation.find({}, function(err, preservations) {
		if (err) {
			console.log('find failed....');
		} else {
			res.render('index', {preservations: preservations});
		}
	})
});

// get the actual saved surveys


// LOGOUT REQUEST - logout comes from passport
router.get('/logout', function(req, res) {
	// destroy the session
	req.logout();
	res.redirect('/');
});


// All other routes
router.get('*', function(req, res) {
	res.redirect('/inspections');
})

/*

	MIDDLEWARE - THREE PARAMS
	1. REQUEST
	2. RESPONE
	3. NEXT FUNCTION

*/


// middleware function to check user is logged in
// request, response and next, move onto callback in the function where this is used
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};


module.exports = router;