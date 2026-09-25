const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const validateArticle = require('../middlewares/validateArticle');
const validateDateFormat = require('../middlewares/validateDate');
const validateTextLength = require('../middlewares/validateTextLength');

const articleRouter = express.Router();
const dbPath = path.join(__dirname, '../db.json');

const readDb = async () => {
    const rawData = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(rawData);
};

const writeDb = async (data) => {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

articleRouter.route('/')
    .get(async (req, res, next) => {
        try {
            const db = await readDb();
            res.status(200).json(db.articles);
        } catch (err) {
            next(err);
        }
    })
    .post(
        validateArticle, 
        validateDateFormat, 
        validateTextLength(10, 5000), 
        async (req, res, next) => {
            try {
                const { title, date, author } = req.body;
                const text = req.body.text || req.body.content;

                const db = await readDb();
                const newId = db.articles && db.articles.length > 0 
                    ? Math.max(...db.articles.map(a => a.id)) + 1 
                    : 1;

                const newArticle = {
                    id: newId,
                    title,
                    date,
                    author: author || 'Anonymous',
                    content: text,
                    comments: []
                };

                db.articles.push(newArticle);
                await writeDb(db);

                res.status(201).end(`Will add the article: ${title} with details: ${text} and ${date}`);
            } catch (err) {
                res.status(400).json({ message: err.message });
            }
        }
    )
    .put((req, res, next) => {
        const error = new Error('PUT operation not supported on /articles');
        error.status = 403;
        next(error);
    })
    .delete(async (req, res, next) => {
        try {
            const db = await readDb();
            const totalDeleted = db.articles.length;
            db.articles = [];
            await writeDb(db);

            res.status(200).json({
                message: 'Deleting all articles',
                deletedCount: totalDeleted
            });
        } catch (err) {
            next(err);
        }
    });

articleRouter.route('/:id')
    .get(async (req, res, next) => {
        try {
            const targetId = parseInt(req.params.id, 10);
            const db = await readDb();
            const article = db.articles.find(a => a.id === targetId);

            if (!article) {
                const error = new Error(`Article with id ${req.params.id} not found`);
                error.status = 404;
                throw error;
            }

            res.status(200).json({ success: true, data: article });
        } catch (err) {
            next(err);
        }
    })
    .post((req, res, next) => {
        const error = new Error(`POST operation not supported on /articles/${req.params.id}`);
        error.status = 403;
        next(error);
    })
    .put(validateDateFormat, validateTextLength(10, 5000), async (req, res, next) => {
        try {
            const targetId = parseInt(req.params.id, 10);
            const { title, date } = req.body;
            const content = req.body.text || req.body.content;

            const db = await readDb();
            const index = db.articles.findIndex(a => a.id === targetId);

            if (index === -1) {
                const error = new Error(`Article with id ${req.params.id} not found`);
                error.status = 404;
                throw error;
            }

            db.articles[index] = {
                ...db.articles[index],
                ...(title && { title }),
                ...(date && { date }),
                ...(content && { content })
            };

            await writeDb(db);

            res.status(200).json({
                message: `Article ${req.params.id} updated successfully`,
                data: db.articles[index]
            });
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const targetId = parseInt(req.params.id, 10);
            const db = await readDb();
            const index = db.articles.findIndex(a => a.id === targetId);

            if (index === -1) {
                const error = new Error(`Article with id ${req.params.id} not found`);
                error.status = 404;
                throw error;
            }

            const deleted = db.articles.splice(index, 1)[0];
            await writeDb(db);

            res.status(200).json({
                message: `Deleting article: ${req.params.id}`,
                data: deleted
            });
        } catch (err) {
            next(err);
        }
    });

module.exports = articleRouter;