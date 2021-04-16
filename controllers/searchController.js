const productModel = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// regex ptan for search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = {
    //get product by name
    getByName: catchAsync(async (req,res,next) => {
        //get the search word from client with req.body.word
        var {word} = req.body;

        if (word) {

            const regex = new RegExp(escapeRegex(word), 'gi');
            //search by name or category or keyFeatures
           await productModel.find({$or:[{ "name": regex },{"category":regex},{"keyFeatures":regex}]}, function(err, foundProduct) {
                if(err){
                    new AppError("sorry somthing went wrong", 401)
                    console.log(err);
                }else{
                    if(foundProduct.length < 1){
                        new AppError("item not found", 404)
                    }else{
                        res.status(201).json({
                            status:"success",
                            data:foundProduct
                        })
                    }
                }
            }); 
         }
    })
}