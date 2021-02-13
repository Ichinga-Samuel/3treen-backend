const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
     type: String,
     required: true,
     trim: true 
  },

  price: {
     type: Number,
    required: true 
  },

  images: [String],

  description: {
    type: String,
    required: [true, 'A product must have a description'],
    trim: true
    
  },

  keyFeatures: {
    type: String,
    required: [true, 'A product must have key features'],
    trim: true,
  },

  specification: {
    type: String,
    required: [true, 'A product must have a specification'],
    trim: true,
  },

  category: {
    type: String,
    required: [true, 'A product must have a category'],
    // default: 'Electronics',
  },

  avrageRating:{
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },

  ratingsQuantity:{
    type:Number,
    default:0
  }
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews",{
  ref:"ProductReview",
  foreignField:'reviewdProduct',
   localField: '_id'
});



// productSchema.pre(/^find/,(next)=>{
//   this.virtual("review",{
//     ref:"ProductReview",
//      foreignField:'reviewdProduct',
//       localField: '_id'
//   });
//   next()
// })


module.exports = mongoose.model('Product', productSchema);
