const Goal = require('../models/Goal');

const getGoal = async (req, res) => {
  try {
    let goal = await Goal.findOne({ userId: req.user.id });
    
    // Create a default one if it doesn't exist
    if (!goal) {
      goal = await Goal.create({
        userId: req.user.id,
        name: 'Set your first goal',
        targetAmount: 1,
        currentAmount: 0
      });
    }
    
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount } = req.body;
    const goal = await Goal.findOneAndUpdate(
      { userId: req.user.id },
      { name, targetAmount, currentAmount },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getGoal,
  updateGoal
};
