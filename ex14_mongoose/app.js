const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');

const Article = require('./models/article');

const app = express();

// MongoDB connection
mongoose.set('strictQuery', true);

const mongoUrl = 'mongodb://127.0.0.1:27017/newspapers';

async function connectDatabase() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    // Tạo bài viết mẫu nếu collection đang trống
    const count = await Article.countDocuments();

    if (count === 0) {
      const newArticle = new Article({
        title: 'Short News',
        text: 'Paris is known for its iconic landmarks like the Eiffel Tower and Louvre.',
        comments: [
          { body: 'Great article!' }
        ],
        tags: ['News']
      });

      const savedArticle = await newArticle.save();
      console.log('Article saved:', savedArticle);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

connectDatabase();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error =
    req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  res.render('error');
});

// Close MongoDB connection
async function closeDatabaseConnection() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
}

process.on('SIGINT', closeDatabaseConnection);
process.on('SIGTERM', closeDatabaseConnection);

module.exports = app;