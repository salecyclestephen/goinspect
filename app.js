const express 			= require('express'),
	  bodyParser 		= require('body-parser'),
	  mongoose 			= require('mongoose'),
	  methodoverride  	= require('method-override'),
	  passport 			= require('passport'),
	  LocalStrategy 	= require('passport-local')
	  session 			= require('express-session'),
	  passport_local 	= require('passport-local-mongoose');  

const app 				= express();

const indexRoute 		= require('./routes/index');
const User		        = require('./models/user');


// db connection
mongoose.connect('mongodb+srv://mongo_admin:0VZuId9Oz08rBuoI@yelpcamp.5yojd.mongodb.net/goinspect?retryWrites=true&w=majority');


app.set('view engine', 'ejs');

// secret to encode/decode
app.use(session({
	secret: 'test secret string',
	resave: false,
	saveUninitialized: false
	// ^^ resave && saveUninitialized are required buy the session module - maybe read into these more
}));

// lets ensure passport is being used - always need these two
app.use(passport.initialize());
app.use(passport.session());

// two really important calls - reading the session and decoding it, then encoding it - these are passed in from the user.js UserSchema.plugin call
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// third authenticate the login
passport.use(new LocalStrategy(User.authenticate()));

// IMPORTANT - pass the current user into every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

// allows the body of requests to be retrieved from a form
app.use(bodyParser.urlencoded({extended:true}));

// HTML forms doesn't support PUT or DELETE so to follow conventions we must use this method override
// form action will have a query string on the end ?_method=PUT
app.use(methodoverride('_method'));

app.use(indexRoute);

/*
	START THE SERVER LOCALLY
*/

const port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log("Server Has Started!");
});