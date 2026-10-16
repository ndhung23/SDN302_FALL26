const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Article title is required.'],
    minlength: [5, 'Title must be at least 5 characters.'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Article date is required.']
  },
  text: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || v.length > 10;
      },
      message: 'Article text must be longer than 10 characters.'
    }
  },
  author: {
    type: String
  },
  content: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  }
});

const Article = mongoose.model('Articles', articleSchema);

module.exports = Article;

