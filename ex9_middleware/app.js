const express = require('express');
const articleRouter = require('./routers/articleRouter');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/articles', articleRouter);

app.use((req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        status,
        error: err.message || 'Internal Server Error'
    });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));