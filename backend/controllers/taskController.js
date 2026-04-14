const Task = require('../models/Task');

const buildRecommendation = ({ mood, stressLevel, sleepHours, selfCareActivity }) => {
  if (mood === 'Very Low' || stressLevel >= 8) {
    return 'Your check-in suggests a high-stress day. Try a short grounding exercise, reduce non-essential tasks, and reach out to a trusted person if the feeling stays heavy.';
  }

  if (sleepHours < 6) {
    return 'Low sleep can strongly affect mood. Aim for a lighter evening routine, reduce screen time before bed, and prioritise recovery tonight.';
  }

  if (!selfCareActivity) {
    return 'You have room for a small wellbeing win today. Consider a 10-minute walk, stretching, journaling, or a short breathing exercise.';
  }

  if (mood === 'Excellent' || mood === 'Good') {
    return 'You are showing positive momentum. Capture what helped today so you can repeat the same habit on tougher days.';
  }

  return 'Keep building consistency with small daily reflections. Notice one helpful pattern from today and carry it into tomorrow.';
};

const normaliseFeelings = (feelings = []) =>
  Array.isArray(feelings)
    ? feelings
        .map((feeling) => String(feeling).trim())
        .filter(Boolean)
        .slice(0, 6)
    : [];

const parseDateBoundary = (value, boundary) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (boundary === 'start') {
    date.setHours(0, 0, 0, 0);
  }

  if (boundary === 'end') {
    date.setHours(23, 59, 59, 999);
  }

  return date;
};

const getTasks = async (req, res) => {
  try {
    const query = { userId: req.user.id };

    if (req.query.mood) {
      query.mood = req.query.mood;
    }

    if (req.query.from || req.query.to) {
      query.entryDate = {};

      if (req.query.from) {
        const fromDate = parseDateBoundary(req.query.from, 'start');

        if (!fromDate) {
          return res.status(400).json({ message: 'Invalid from date' });
        }

        query.entryDate.$gte = fromDate;
      }

      if (req.query.to) {
        const toDate = parseDateBoundary(req.query.to, 'end');

        if (!toDate) {
          return res.status(400).json({ message: 'Invalid to date' });
        }

        query.entryDate.$lte = toDate;
      }

      if (query.entryDate.$gte && query.entryDate.$lte && query.entryDate.$gte > query.entryDate.$lte) {
        return res.status(400).json({ message: 'From date must be earlier than or equal to the to date' });
      }
    }

    const entries = await Task.find(query).sort({ entryDate: -1, createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch journal entries', error: error.message });
  }
};

const getTaskSummary = async (req, res) => {
  try {
    const entries = await Task.find({ userId: req.user.id }).sort({ entryDate: -1, createdAt: -1 });

    const totalEntries = entries.length;
    const averageStress = totalEntries
      ? Number((entries.reduce((sum, entry) => sum + (entry.stressLevel || 0), 0) / totalEntries).toFixed(1))
      : 0;
    const averageSleep = totalEntries
      ? Number((entries.reduce((sum, entry) => sum + (entry.sleepHours || 0), 0) / totalEntries).toFixed(1))
      : 0;

    const moodBreakdown = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalEntries,
      averageStress,
      averageSleep,
      latestEntry: entries[0] || null,
      moodBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch summary', error: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const entryPayload = {
      userId: req.user.id,
      title: req.body.title,
      note: req.body.note,
      mood: req.body.mood,
      feelings: normaliseFeelings(req.body.feelings),
      gratitude: req.body.gratitude || '',
      selfCareActivity: req.body.selfCareActivity || '',
      sleepHours: req.body.sleepHours,
      stressLevel: req.body.stressLevel,
      entryDate: req.body.entryDate,
      isPrivate: true,
    };

    entryPayload.recommendation = buildRecommendation(entryPayload);

    const entry = await Task.create(entryPayload);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: 'Unable to create journal entry', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const entry = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    entry.title = req.body.title ?? entry.title;
    entry.note = req.body.note ?? entry.note;
    entry.mood = req.body.mood ?? entry.mood;
    entry.feelings = req.body.feelings ? normaliseFeelings(req.body.feelings) : entry.feelings;
    entry.gratitude = req.body.gratitude ?? entry.gratitude;
    entry.selfCareActivity = req.body.selfCareActivity ?? entry.selfCareActivity;
    entry.sleepHours = req.body.sleepHours ?? entry.sleepHours;
    entry.stressLevel = req.body.stressLevel ?? entry.stressLevel;
    entry.entryDate = req.body.entryDate ?? entry.entryDate;
    entry.isPrivate = true;
    entry.recommendation = buildRecommendation(entry);

    const updatedEntry = await entry.save();
    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: 'Unable to update journal entry', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const entry = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete journal entry', error: error.message });
  }
};

module.exports = { getTasks, getTaskSummary, addTask, updateTask, deleteTask };
