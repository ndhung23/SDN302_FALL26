const express = require('express');
const videoRouter = express.Router();

videoRouter.use(express.json());
videoRouter.use(express.urlencoded({ extended: true }));

videoRouter.route('/')
  .get(async (req, res) => {
    try {
      res.status(200).end('Will send all the videos to you!');
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      res.status(201).json(
        'Will add the video: ' + req.body.title + 
        ' with details: ' + (req.body.text || req.body.content) + 
        ' and ' + req.body.date
      );
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
  .put(async (req, res) => {
    try {
      res.status(403).json('PUT operation not supported on /videos');
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      res.status(200).json('Deleting all videos');
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

videoRouter.route('/:id')
  .get(async (req, res) => {
    try {
      res.status(200).end('Will send details of the video: ' + req.params.id + ' to you!');
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      res.status(403).end('POST operation not supported on /videos/' + req.params.id);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
  .put(async (req, res) => {
    try {
      res.write('Updating the video: ' + req.params.id + '\n');
      res.status(201).end(
        'Will update the video: ' + req.body.title + 
        ' with details: ' + (req.body.text || req.body.content) + 
        ' and ' + req.body.date
      );
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      res.status(200).end('Deleting video: ' + req.params.id);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = videoRouter;