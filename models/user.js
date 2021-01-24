const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    //An alternative to regex to perform email validation
    validate: [validator.isEmail, 'Please Provide a valid email'],
  },

  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, 'A password should be at least 8 characters'],
  },

  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        // This only works on CREATE and SAVE!!!
        return el === this.password;
      },

      message: 'Passwords are not the same!',
    },
  },

  homePhone: {
    type: Number,
  },

  workPhone: {
    type: Number,
  },
});

module.exports = mongoose.model('User', userSchema);
