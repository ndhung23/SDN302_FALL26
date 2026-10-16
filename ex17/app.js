require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const connectDB = require('./config/db');
const articleRouter = require('./routes/articleRouter');
const commentRouter = require('./routes/commentRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Exercise 17: Applying MVC');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;

