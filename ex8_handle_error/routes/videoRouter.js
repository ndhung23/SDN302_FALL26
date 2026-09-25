const express = require('express');
const videoRouter = express.Router();

videoRouter.route('/')
    .get(async (req, res, next) => {
        try {
            res.status(200).send('Will send all the videos to you!');
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const { title, date } = req.body;
            const content = req.body.text || req.body.content;
            if (!title || !content || !date) {
                const error = new Error('Missing required video fields');
                error.status = 400;
                throw error;
            }
            res.status(201).send(`Will add the video: ${title} with details: ${content} and ${date}`);
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const error = new Error('PUT operation not supported on /videos');
            error.status = 403;
            throw error;
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            res.status(200).send('Deleting all videos');
        } catch (err) {
            next(err);
        }
    });

videoRouter.route('/:id')
    .get(async (req, res, next) => {
        try {
            res.status(200).send(`Will send details of the video: ${req.params.id} to you!`);
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const error = new Error(`POST operation not supported on /videos/${req.params.id}`);
            error.status = 403;
            throw error;
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const { title, date } = req.body;
            const content = req.body.text || req.body.content;
            if (!title || !content || !date) {
                const error = new Error('Missing required video fields to update');
                error.status = 400;
                throw error;
            }
            res.status(200).send(`Will update the video: ${title} with details: ${content} and ${date}`);
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            res.status(200).send(`Deleting video: ${req.params.id}`);
        } catch (err) {
            next(err);
        }
    });

module.exports = videoRouter;