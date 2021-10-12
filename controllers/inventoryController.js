const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {queryFormater, searchRanker} = require('../utils/searchUtils');
const Products = require('../models/productModel');


module.exports.search = catchAsync(async (req, res, next)=>{
    try{
        let query = req.query.query
        query = queryFormater(query)
        let find = {}
        find["$or"] = [{name: query}, {keyFeatures: query}, {description: query}, {specification: query}]
        if(req.query.minPrice){
            find['price'] = {$gte: req.query.minPrice}
        }
        if(req.query.maxPrice){
            find['price'] = {$lte: req.query.maxPrice}
        }
        if(req.query.priceRange){
            let [minPrice, maxPrice] = req.query.priceRange.split('-').map(p => parseInt(p))
            if(maxPrice && minPrice){
                find['price'] = {$gte: minPrice, $lte: maxPrice}
            }
        }
        if(req.query.category){
            find['category'] = req.query.category
        }

        let products = await Products.find(find).populate({path: 'reviews'}).sort('-createdAt price')
        searchRanker(req.query.query, products)
        res.status(200).json({status: 'success', size: products.length, products})
    }
    catch(e){
        next(e)
    }
})

module.exports.all = catchAsync(async (req, res, next) => {
    try{
        let products = await Products.find({}).populate({path: 'reviews'}).sort('-createdAt price')
        res.status(200).json({status: 'success', size: products.length, products})
    }
    catch (e){
        next(e)
    }
})
