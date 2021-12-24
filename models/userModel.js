const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  verified: {
    type: String,
    default: false,
  },

  photo: {
    type: String,
    default: 'default.jpg',
  },

  address: {
    type: String,
  },

  state: {
    type: String,
    lowercase: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    //An alternative to regex to perform email validation
    validate: [validator.isEmail, 'Please Provide a valid email'],
  },

  products: [],

  password: {
    hash: {
      type: String,
      required: true
    },
    salt: String
  },

  homePhone: {
    type: Number,
  },

  workPhone: {
    type: Number,
  },

  rating: {
    type: {
      count: {type: Number, default: 0},
      average: {type: Number, default: 0}
    }
  },

  role: {
    type: String,
    enum: ['admin', 'sub-admin', 'user', 'QA', 'SR', 'company', 'vendor', 'CST'],
    default: 'user',
  },
  lastLoginTime: Date,
  lastLogoutTime: Date,
  passwordChangedAt:{
    type: Date,
    default: new Date()
  }
});

//INSTANCE METHODS
userSchema.methods.setPassword = function(pwd){
  this.password.salt = crypto.randomBytes(32).toString('hex');
  this.password.hash = crypto.pbkdf2Sync(pwd, this.password.salt, 10000, 64, "sha512").toString('hex');
};

userSchema.methods.isValidPassword = function(pwd){
  const hash = crypto.pbkdf2Sync(pwd, this.password.salt, 10000, 64, "sha512").toString('hex');
  return this.password.hash === hash
};

userSchema.methods.genJwt = function(){
  const expire = new Date();
  expire.setDate(expire.getDate() + 1);
  return jwt.sign({
        id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expire.getTime() / 1000, 10)
      }, process.env.JWT_SECRET
  )
};
;

module.exports = mongoose.model('User', userSchema);
