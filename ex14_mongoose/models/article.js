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
        required: [true, 'Article text is required.'],
        validate: {
            validator: function(value) {
                return value.length >= 20;
            }
        },
        message: 'Article text must be longer than 10 characters.',
    },
    comments: [{
        body: {
            type: String,
            required: [true, 'Comment body is required.'],
        },
        date: {
            type: Date,
            default: Date.now,
        }
    }],
    tags: {
        type: [String],
        validate: {
            validator: function(value) {
                return value.length > 0;
            },
            message: 'There should be at least 1 tag..'
        }
    }
})

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;