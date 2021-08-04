const mongoose = require("mongoose");
const productModel = require("./productModel")

const reviewSchema = mongoose.Schema({
    //getting the reviewrs identity
    reviewer:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'The reviewer identity is required'],
        ref:"User"
    },

    //review
    message:{
        type:String,
        required:[true,'comment is required']
    },

    //ratting with max of 5
    rattingNumber:{
        type:Number,
        max: 5,
        min:1,
        required:true
    },

    //reviewDate
    dateOfReview:{
        type: Date,
        default: Date.now(),
        required:true
    },

    //the reviewed prouduct
    reviewdProduct:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"A review must be maped to a product"],
        ref:"Product"
    }

},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.pre(/^find/, function (next) {

  this.populate({
    path: 'reviewer',
    select: 'fullName photo _id',
  });
  next()
});

reviewSchema.statics.calcAverageRatings = async function(productID){
    // In Static Methods the "this" keyword points to the current model, in the case (The Review Model)
    const stats = await this.aggregate([
      // The Aggregate method always returns a promise
      {
        $match: {reviewdProduct: productID },
      },
      {
        $group: {
          _id: '$productID',
          nRating: { $sum: 1 },
          avgRating: { $avg: '$rattingNumber' },
        },
      },
    ]);

    if (stats.length > 0) {
      await productModel.findByIdAndUpdate(productID, {
        avrageRating: stats[0].avgRating,
        ratingsQuantity: stats[0].nRating,
      });
    } else {
      await productModel.findByIdAndUpdate(productID, {
        avrageRating: 4.5,
        ratingsQuantity: 0,
      });
    }
  };



  //calling the static method using this.constructure.calcAverageRatings() befor reviews is created
reviewSchema.post("save", function(next){
  this.constructor.calcAverageRatings(this.reviewdProduct._id)
})

let rewiewdModel = mongoose.model("ProductReview", reviewSchema);

module.exports = rewiewdModel;