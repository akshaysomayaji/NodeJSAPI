var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var sellarbusinessSchema = new Schema({
	sellarname: { type: String, required: true, unique: true },
	sellarcategory: { type: String, required: true },
	sellarlocation: { type: String, required: true },
	gstin: { type: String, required: true, unique: true },
	pan: { type: String, required: true, unique: true },
	address: { type: String, required: false },
	sellaremailid: { type: String, required: false, unique: true },
	gstcertificate: { type: Buffer, required: false },
	pancertificate: { type: Buffer, required: false },
});

mongoose.model('SellarBusiness', sellarbusinessSchema);