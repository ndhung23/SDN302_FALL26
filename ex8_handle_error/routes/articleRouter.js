const express = require('express');
const fs = require('fs').promises;
const path = require('path');

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
            res.status(200).json({
                success: true,
                total: db.articles.length,
                data: db.articles
            });
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const { title, date, author } = req.body;
            const content = req.body.text || req.body.content;

            if (!title || !content || !date) {
                const error = new Error('Missing required article fields');
                error.status = 400;
                throw error;
            }

            const db = await readDb();
            const newId = db.articles.length > 0 ? Math.max(...db.articles.map(a => a.id)) + 1 : 1;
            const newArticle = {
                id: newId,
                title,
                date,
                author: author || 'Anonymous',
                content,
                comments: []
            };

            db.articles.push(newArticle);
            await writeDb(db);

            res.status(201).json({
                message: 'Article saved successfully'
            });
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const error = new Error('PUT operation not supported on /articles');
            error.status = 403;
            throw error;
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const db = await readDb();
            db.articles = [];
            await writeDb(db);
            res.status(200).send(`Deleting article: ${db.id}`)
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

            res.status(200).json({
                success: true,
                data: article
            });
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const error = new Error(`POST operation not supported on /articles/${req.params.id}`);
            error.status = 403;
            throw error;
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const targetId = parseInt(req.params.id, 10);
            const { title, date } = req.body;
            const content = req.body.text || req.body.content;

            if (!title || !content || !date) {
                const error = new Error('Missing required article fields to update');
                error.status = 400;
                throw error;
            }

            const db = await readDb();
            const index = db.articles.findIndex(a => a.id === targetId);

            if (index === -1) {
                const error = new Error(`Article with id ${req.params.id} not found`);
                error.status = 404;
                throw error;
            }

            db.articles[index] = {
                ...db.articles[index],
                title,
                date,
                content
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

            const deletedArticle = db.articles.splice(index, 1)[0];
            await writeDb(db);

            res.status(200).send(`Deleting article: ${req.params.id}`)
        } catch (err) {
            next(err);
        }
    });

module.exports = articleRouter;