
const express = require('express');
const { getTasks, getTaskSummary, addTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/summary', protect, getTaskSummary);
router.route('/').get(protect, getTasks).post(protect, addTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
