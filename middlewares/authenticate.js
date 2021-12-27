const jwt = require("express-jwt");

const User = require('../models/userModel')
const AppError = require('../utils/appError');


revoked = async function(req, payload, done){
    let user = await User.findById(payload.id).select('passwordChangedAt')
    if(!user){
        let err =  new AppError('This user no longer exists.', 401)
        return done(err)
    }
    let iat = new Date(payload.iat*1000)
    if(user.passwordChangedAt > iat){
        let err = new AppError('You recently changed your password! Please login  again', 401)
        return done(err)
    }

    return done(null)
}

exports.auth = jwt({
    secret: process.env.JWT_SECRET,
    requestProperty: 'user',
    algorithms: ["HS256"],
    isRevoked: revoked
});
