let express = require('express');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt-nodejs');
let router = express.Router();
let User = require('../models/user');
let Bar = require('../models/bars');
let Yelp = require('yelp');


router.get('/location/:zip', (request, response) => {
	var yelp = new Yelp({
	  	consumer_key: process.env.consumerKey,
	  	consumer_secret: process.env.consumerSecret,
	  	token: process.env.token,
	  	token_secret: process.env.tokenSecret
	});

	yelp.search({ term: 'bars', location: request.params.zip })
		.then(function (data) {
		  return response.status(200).send(data);
		})
		.catch(function (err) {
		  return response.status(400).send(err);
		});
});


router.post('/login', (request, response) => {
	console.log(request.body);
	if(request.body.name && request.body.password) {
		User.findOne({ name:  request.body.name }, (err, user) => {
			if(err) {
				return response.status(400).send(err)
			}
			if(!user) {
				return response.status(404).send('No user with this account is registered');
			}
			var token = jwt.sign({
				data: user
			}, process.env.secret, { expiresIn: 3600 });
			return response.status(200).send(token);
		});
	}
	else {
		return response.status(400).send('Please fill out all fields');
	}
});

router.post('/register', (request, response) => {
	if(request.body.name && request.body.password && request.body.location) {
		var user = new User();
		user.name = request.body.name;
		user.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));
		user.location = request.body.location;
		user.save((err, resource) => {
			if(err) {
				return response.status(400).send(err);
			}
			var token = jwt.sign({
				data: resource
			}, process.env.secret, { expiresIn: 3600});
			return response.status(201).send(token);
		});
	}
	else {
		return response.status(400).send('Must fill out all fields');
	};
});

module.exports = router;