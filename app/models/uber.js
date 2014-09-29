// app/models/uber.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UberSchema = new Schema({
	name: String,
	latitude: Number,
	longitude: Number,
	address: String
});

module.exports = mongoose.model('Uber', UberSchema);