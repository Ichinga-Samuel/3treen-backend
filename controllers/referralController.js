const Referral = require('../models/referralModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/catchAsync');

exports.getRefStats = catchAsync(async (req, res, next) => {
  //Get Sales Rep Id from params
  const { id } = req.params;

  const referrals = await Referral.aggregate([
    {
      $match: { salesRepId: id },
    },

    {
      $group: {
        _id: { $month: '$createdAt' },
        numReferrals: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: referrals.length,
    referrals,
  });
});
