const productModel = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const paginator = require("../utils/pagination");
const rexSeach = require("../utils/searchExp");


module.exports ={
    categoryFilter: catchAsync(async (req,res,next)=>{
        // "?filter=laptop&page=2&limit=10"
        let {page,limit,filter} = req.query

        const regex = new RegExp(rexSeach.escapeRegex(filter), 'gi');

        const productResult = await productModel.find({"category":regex})
       
        
        if(productResult.length < 1){
            new AppError("Category not found", 404)
        }
        let usedData = paginator.paginateProductByTen(productResult,page,limit)

        res.status(201).json({
            status:"success",
            data:usedData
        })
    })
}