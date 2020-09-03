const express 			= require('express');

const app 				= express();

const indexRoute 		= require('./routes/index');

app.set('view engine', 'ejs');

app.use(indexRoute);

app.listen(4000, function() {
	console.log('go insect has started!');
})