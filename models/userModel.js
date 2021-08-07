const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
  passwordChangedAt: Date,
  passwordResetCode: Number,
  passwordResetExpires: Date,
  passwordRE: Number,
});

//DOCUMENT MIDDLEWARE
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  //Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
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

// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };

module.exports = mongoose.model('User', userSchema);
