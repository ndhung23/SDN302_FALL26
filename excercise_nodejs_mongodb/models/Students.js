const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentCode: {
      type: String,
      required: [true, 'Mã sinh viên là bắt buộc'],
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: [true, 'Họ và tên là bắt buộc'],
      trim: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    dateOfBirth: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true
    },
    major: {
      type: String,
      required: [true, 'Chuyên ngành là bắt buộc']
    },
    year: {
      type: Number,
      required: true,
      min: 1
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4.0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Student', studentSchema);