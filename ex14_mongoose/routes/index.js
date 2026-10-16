const express = require('express');
const mongoose = require('mongoose');
const Article = require('../models/article');

const router = express.Router();

/*
 * GET /
 * Kiểm tra server
 */
router.get('/', function (req, res) {
  res.json({
    success: true,
    message: 'Express and Mongoose application is running'
  });
});

/*
 * GET /articles
 * Lấy danh sách tất cả bài viết
 */
router.get('/articles', async function (req, res) {
  try {
    const articles = await Article.find().sort({
      date: -1
    });

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách bài viết',
      error: error.message
    });
  }
});

/*
 * GET /articles/:id
 * Lấy một bài viết theo ID
 */
router.get('/articles/:id', async function (req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin bài viết',
      error: error.message
    });
  }
});

/*
 * POST /articles
 * Thêm bài viết mới
 */
router.post('/articles', async function (req, res) {
  try {
    const { title, text, comments, tags } = req.body;

    const newArticle = new Article({
      title,
      text,
      comments: comments || [],
      tags
    });

    const savedArticle = await newArticle.save();

    res.status(201).json({
      success: true,
      message: 'Thêm bài viết thành công',
      data: savedArticle
    });
  } catch (error) {
    /*
     * Xử lý lỗi validation của Mongoose
     */
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        function (item) {
          return item.message;
        }
      );

      return res.status(400).json({
        success: false,
        message: 'Dữ liệu bài viết không hợp lệ',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Không thể thêm bài viết',
      error: error.message
    });
  }
});

/*
 * PUT /articles/:id
 * Cập nhật toàn bộ bài viết
 */
router.put('/articles/:id', async function (req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        text: req.body.text,
        comments: req.body.comments,
        tags: req.body.tags
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedArticle) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật bài viết thành công',
      data: updatedArticle
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        function (item) {
          return item.message;
        }
      );

      return res.status(400).json({
        success: false,
        message: 'Dữ liệu cập nhật không hợp lệ',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật bài viết',
      error: error.message
    });
  }
});

/*
 * PATCH /articles/:id
 * Cập nhật một phần bài viết
 */
router.patch('/articles/:id', async function (req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedArticle) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật bài viết thành công',
      data: updatedArticle
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        function (item) {
          return item.message;
        }
      );

      return res.status(400).json({
        success: false,
        message: 'Dữ liệu cập nhật không hợp lệ',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật bài viết',
      error: error.message
    });
  }
});

/*
 * DELETE /articles/:id
 * Xóa bài viết
 */
router.delete('/articles/:id', async function (req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      });
    }

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa bài viết thành công',
      data: deletedArticle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa bài viết',
      error: error.message
    });
  }
});

module.exports = router;
