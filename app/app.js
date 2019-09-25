// Prepare dependencies
const http = require("http");
const express = require('express');
const cookieParser = require('cookie-parser');
const escape = require('escape-html');
const serialize = require('node-serialize');
const bodyParser = require('body-parser');

// Initialize the application
const startingPort = 8080;
const cookieName = 'userInfo';

var app = express();
app.use(cookieParser())
var urlencodedParser = bodyParser.urlencoded({ extended: true });

// Get API Endpoint
app.get('/', function(req, res) {
	try {
		if (req.cookies.userInfo) {
			// Decode the base64 and deserialize the object
			var userInfoString = new Buffer(req.cookies.userInfo, 'base64').toString();
			var userInfoObject = serialize.unserialize(userInfoString);

			// If we find the userName in the received object we display the name
			if (userInfoObject.userName) {
				res.send("Welcome back " + escape(userInfoObject.userName));
			}
		}
	}
	catch(error){
		console.log(error);
	}
	
	// Load the HTML template
	res.sendFile('./index.html',{root: __dirname });
});

// POST API Endpoint to get the user name
app.post('/form', urlencodedParser, function(req, res) {
	try {		
		// Prepare default response
		var userInfo = { "userName": "Anonymous"};
		var encodedCookie = '';
		
		// Basic filter and set userName
		if (req.body.userName) {			
			var username = JSON.stringify(req.body.userName).replace(/[^0-9a-z]/gi, '');
			userInfo.userName = username;
		}
	}
	catch(error) {
		console.log(error);
	}	
	// Encode the serialized object and set it as a cookie
	var encodedCookie = new Buffer(JSON.stringify(userInfo)).toString('base64');
	res.cookie(cookieName, encodedCookie);
	
	res.redirect(303,'/');
});

// Start the application
app.listen(startingPort);