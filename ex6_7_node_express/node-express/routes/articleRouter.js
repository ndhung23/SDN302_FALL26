const express = require('express');
const articleRouter = express.Router();

articleRouter.use(express.json());
articleRouter.use(express.urlencoded({ extended: true }));
articleRouter.route('/')
    .get( async (req, res) => {
        try {
            res.status(200).end('Will send all the articles to you!');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .post( async (req, res) => {
        try {
            const title = req.body.title;
            const text = req.body.text;
            const date = req.body.date;
            res.status(201).end(`Will add the article: ${title} with details: ${text} and ${date}`);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    })
    // PUT a new article
    .put( async (req, res) => {
        try {
            res.status(403).end('PUT operation not supported on /articles');
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    })
    // DELETE all articles
    .delete( async (req, res) => {
        try {
            res.status(200).end('Deleting all articles');
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

articleRouter.route('/:id')
  .get(async (req, res) => {
    try {
      res.status(200).end('Will send details of the article: ' + req.params.id + ' to you!');
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      res.status(403).end('POST operation not supported on /articles/' + req.params.id);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
  .put(async (req, res) => {
    try {
      res.write('Updating the article: ' + req.params.id + '\n');
      res.status(201).end(
        'Will update the article: ' + req.body.title + 
        ' with details: ' + req.body.text + 
        ' and ' + req.body.date
      );
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      res.status(200).end('Deleting article: ' + req.params.id);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = articleRouter;