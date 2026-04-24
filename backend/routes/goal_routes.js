const express = require('express');
const goalController = require('../controllers/goalController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/', goalController.getGoal);
router.put('/', goalController.updateGoal);

module.exports = router;
