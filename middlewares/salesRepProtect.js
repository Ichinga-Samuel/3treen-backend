const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//Access Control
exports.accessControl = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'SR') {
    return next(new AppError('Only Sales Reps can do this', 403));
  }

  next();
});
