const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    const numDocs = await Model.countDocuments();

    const limit = 8;

    const pages = Math.ceil(numDocs / limit);

    res.status(200).json({
      status: 'success',
      results: doc.length,
      pages,
      doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // console.log('this doc', doc, typeof doc);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: doc,
    });
  });
