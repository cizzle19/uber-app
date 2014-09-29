//server.js
// modules ==================================================
var express 		= require('express');
var app 			= express();
var mongoose 		= require('mongoose');
var bodyParser 		= require('body-parser');
var methodOverride 	= require('method-override');

// configuration ============================================

// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; //set our port
mongoose.connect(db.url); //connect to our mongoDB database (uncomment after you enter in your own credentials in config/db.js)

//get all data/stuff of the body (POST) paramaters
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'})); //parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true})); //parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); //override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); //set the static files location /public/img will be /img for users

// models ====================================================

var Nerd = require('./app/models/nerd');
var Uber = require('./app/models/uber');

// routes for API ============================================

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next){
	//do loggins
	console.log('Something is happening');
	next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res){
	res.json({message:'horray! welcome to our api'});
});
//more routes for our API will happen here

//begin routes that end in /ubers
/***********************************************************/
router.route('/ubers')
	//create an uber location accessed at POST http://localhost:8080/api/ubers
	.post(function(req, res){
		var uber = new Uber(); 				//create new instance of Uber model
		uber.name = req.body.name;
		uber.latitude = req.body.latitude;
		uber.longitude = req.body.longitude;
		uber.address = req.body.address;
		//save the uber location
		uber.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: "Uber location created!"});
		});
	})
	//get all the ubers accessed at GET http://localhost:8080/api/ubers
	.get(function(req,res){
		Uber.find(function(err, ubers){
			if(err){
				res.send(err);
			}
			res.json(ubers);
		});
	});

//begin routes that end in /ubers/:uber_id
/***********************************************************/
router.route('/ubers/:uber_id')
	
	//get the uber with that id accessed at GET http://localhost:8080/api/ubers/:uber_id
	.get(function(req, res){
		Uber.findById(req.params.uber_id, function(err, uber){
			if(err){
				res.send(err);
			}
			res.send(uber);
		});
	})
	//update the current uber
	.put(function(req, res){

	})
	//delete the current uber
	.delete(function(req, res){
		Uber.remove({
			_id: req.params.uber_id
		}, function(err, nerd){
			if(err){
				res.send(err);
			}
			res.json({ message: 'Uber deleted'});
		});
	});



// begin routes that end in /nerds
/***********************************************************/
router.route('/nerds')
	
	//create a nerd (accessed at POST http://localhost:8080/api/nerds)
	.post(function(req, res){
		var nerd = new Nerd();		//create a new isntance of the Nerd Model
		nerd.name = req.body.name;  //set the nerd's name (comes from the request)

		//save the nerd and check for errors
		nerd.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({ message: 'Nerd created!'});
		});

	})
	//get all the nerds (accessed at GET http://localhost:8080/api/nerds)
	.get(function(req, res){
		Nerd.find(function(err, nerds){
			if(err){
				res.send(err);
			}
			res.json(nerds);
		});
	});

// begin routes that end in /nerds/:nerd_id
/***********************************************************/
router.route('/nerds/:nerd_id')
	
	//get the nerd with that id (accessed at GET http://localhost:8080/api/nerds/:nerd_id)
	.get(function(req, res){
		Nerd.findById(req.params.nerd_id, function(err, nerd){
			if(err){
				res.send(err);
			}
			res.json(nerd);
		});
	})
	//update the nerd with this id (accessed at PUT http://localhost:8080/api/nerds/:nerd_id)
	.put(function(req, res){
		
		// use our nerd model to find the nerd we want
		Nerd.findById(req.params.nerd_id, function(err, nerd){
			if(err){
				res.send(err);
			}
			nerd.name = req.body.name; //update the nerds info

			//save the nerd
			nerd.save(function(err){
				if(err){
					res.send(err);
				}
				res.json({ message: 'Nerd updated!'});
			});

		});
	})
	.delete(function(req, res){
		Nerd.remove({
			_id: req.params.nerd_id
		}, function(err, nerd){
			if(err){
				res.send(err);
			}
			res.json({ message: 'Nerd deleted'});
		});
	});


// register our routes
// all of our routes will be prefixed with /api
app.use('/api', router);

// routes ===================================================
require('./app/routes')(app); //configure our routes

// start app ================================================
app.listen(port);								// startup our app at http://localhost:8080
console.log('Magic happens on port' + port);	// shoutout to the users
exports = module.exports = app;