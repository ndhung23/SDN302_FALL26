const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  commenter: {
    type: String
  },
  body: {
    type: String,
    required: [true, 'Comment body is required.']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

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
  comments: [commentSchema],
  tags: {
    type: [String],
    default: []
  }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

