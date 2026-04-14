
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    note: { type: String, required: true, trim: true, maxlength: 2000 },
    mood: {
      type: String,
      required: true,
      enum: ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'],
    },
    feelings: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => value.length <= 6,
        message: 'You can select up to 6 feelings.',
      },
    },
    gratitude: { type: String, trim: true, maxlength: 300, default: '' },
    selfCareActivity: { type: String, trim: true, maxlength: 200, default: '' },
    sleepHours: { type: Number, min: 0, max: 24, default: 8 },
    stressLevel: { type: Number, min: 1, max: 10, default: 5 },
    entryDate: { type: Date, required: true },
    recommendation: { type: String, default: '' },
    isPrivate: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
