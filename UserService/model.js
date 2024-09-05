const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true,"name is required"],
    minlength: 4,
    maxlength: 20
  },
  email: {
    type: String,
    required: [true,"Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true,"password is required"]
  },
  date: {
    type: Date,
    default: Date.now
  },
  verifycode:{
    type: String,
    required: [true,"verifycode is required"]
  },
  isverified:{
    type: Boolean,
    default:false,
    
  },
  verifycodeexpiry:{
    type: Date,
    required: [true,"verifycodeexpiry is required"]
  }
});

module.exports = User = mongoose.model('user', UserSchema);
