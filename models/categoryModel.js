const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    trim: true,
  },
});

module.exports = mongoose.model('Category', categorySchema);
