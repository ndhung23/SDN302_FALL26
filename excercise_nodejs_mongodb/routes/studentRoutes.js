const express = require('express');
const router = express.Router();
const Student = require('../models/Students');

// 1. GET: Lấy danh sách toàn bộ sinh viên
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 2. GET: Lấy chi tiết sinh viên theo _id
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 3. POST: Thêm mới một sinh viên
router.post('/', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    return res.status(201).json(savedStudent);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// 4. PUT: Cập nhật thông tin sinh viên theo _id
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }
    return res.status(200).json(updatedStudent);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// 5. DELETE: Xóa sinh viên theo _id
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }
    return res.status(200).json({ message: 'Đã xóa sinh viên thành công' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;