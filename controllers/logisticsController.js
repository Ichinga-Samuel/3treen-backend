const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Logistics = require('../models/logisticsModel');
// const Order = require('../models/orderModel');

exports.addCompany = factory.createOne(Logistics);

const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//Code to Update fields on the Logistics company model
exports.updateCompany = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'companyName', 'email', 'photo', 'verified', 'phone', 'enabled');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedCompany = await Logistics.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedCompany,
  });
});

exports.rateCompany = catchAsync(async (req, res, next) => {
  const { rating } = req.body
  if(Number(rating) > 5 || Number(rating) < 0){
    res.status(400).json({
      status:"Rating must be between 0 and 5 inclusive"
    })
  }

  const company = await Logistics.findById(req.params.id)
  if(!company){
    res.status(400).json({
      status:"Logistic company not found"
    })
  }

  let count = company.rating.count + 1
  const average = ((company.rating.count*company.rating.average) + rating)/count
  const data = {rating: {count, average} }

  const updatedCompany = await Logistics.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedCompany,
  });
});

//Get a particular company
exports.getCompany = factory.getOne(Logistics);

//GET ALL Companies
exports.getAllCompanies = factory.getAll(Logistics);

// this fetch all companies without pagination
exports.getAllRawCompanies = catchAsync(async (req,res,next)=>{
  const allCompanies = await Logistics.find({})
  if(allCompanies.length > 0){
    res.status(200).json({
      status:"success",
      length:allCompanies.length,
      companies:allCompanies
    })
  }else{
    res.status(400).json({
      status:"not found or somthing went wrong"
    })
  }
});

exports.getCompaniesByState = catchAsync(async (req,res,next)=>{
  let { state } = req.body;
  if(!state){
    res.status(400).json({
      status:"Please specify a state"
    })
  }
  state = state.trim().toLowerCase()
  const stateCompanies = await Logistics.find({state})
  if(stateCompanies.length > 0){
    res.status(200).json({
      status:"success",
      length:stateCompanies.length,
      companies:allCompanies
    })
  }else{
    res.status(400).json({
      status:"not found or somthing went wrong"
    })
  }
});

exports.removeCompany = factory.deleteOne(Logistics);
