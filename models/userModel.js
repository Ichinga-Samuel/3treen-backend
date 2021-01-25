const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

//INSTANCE METHODS
userSchema.methods.correctPassword = async function (
  inputedPassword,
  userPassword
) {
  return await bcrypt.compare(inputedPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPassswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
