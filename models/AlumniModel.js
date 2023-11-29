const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, default:'12345'},
  email: { type: String, required: true, unique: true },
  graduationYear: { type: Number },
  contactInformation: { type: String },
  professionalInformation: { type: String },
  role: { type: String, enum: ['alumni', 'admin'], default: 'alumni' },
  image:{ type:String,default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}

});

const Alumni = mongoose.model('Alumni', alumniSchema);

module.exports = Alumni;
