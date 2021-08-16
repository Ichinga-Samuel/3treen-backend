const productModel = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const rexSeach = require("../utils/searchExp");


module.exports = {
    //get product by name
    getSearchResult: catchAsync(async (req,res,next) => {
        //get the search word from client with req.body.word
        const {search} = req.query;

        if (search) {
            const regex = new RegExp(rexSeach.escapeRegex(search), 'gi');
            //search by name or category or keyFeatures
           await productModel.find({$or:[{ "name": regex },{"category":regex},{"keyFeatures":regex}]}, function(err, foundProduct) {
                if(err){
                    new AppError("sorry somthing went wrong", 401)
                    console.log(err);
                }else{
                    res.status(201).json({
                        status:"success",
                        data:foundProduct
                    })
                }
            }); 
         }
    })
}