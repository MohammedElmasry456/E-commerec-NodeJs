const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const reviewModel = require("../models/reviewModel");
const { deleteImage } = require("../utils/deleteImage");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`not document for this id ${id}`, 404));
    }

    if (model === reviewModel) {
      await document.constructor.calcAvgAndQuantity(document.product);
    }

    await deleteImage(document);
    res.status(204).send();
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const oldDoc = await model.findById(req.params.id);
    if (!oldDoc) {
      return next(
        new ApiError(`not document for this id ${req.params.id}`, 404)
      );
    }
    await deleteImage(oldDoc, req);
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (model === reviewModel) {
      await document.constructor.calcAvgAndQuantity(document.product);
    }
    res.status(200).json({ data: document });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await model.create(req.body);
    res.status(201).json({ data: newDocument });
  });

exports.getOne = (model, option) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = model.findById(id);
    if (option) {
      query = query.populate(option);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError(`not document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const apiFeatures = new ApiFeatures(req.query, model.find(filter))
      .filter()
      .sort()
      .limitFields()
      .search(modelName);

    await apiFeatures.count();
    apiFeatures.paginate(apiFeatures.count);

    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
