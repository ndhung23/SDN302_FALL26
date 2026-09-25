const express = require('express');
const articleRouter = require('./routes/articleRouter');
const videoRouter = require('./routes/videoRouter');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/articles', articleRouter);
app.use('/videos', videoRouter);

app.use((req, res, next) => {
    const err = new Error(`Cannot ${req.method} ${req.originalUrl}`);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        status: statusCode,
        error: err.message || 'An error occurred, please try again later.'
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});