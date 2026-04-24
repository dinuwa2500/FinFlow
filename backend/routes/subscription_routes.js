const express = require('express');
const { createSubscription, getUserSubscriptions, getRecentSubscriptions, deleteSubscription } = require('../controllers/subscriptionController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate);

router.post('/', createSubscription);
router.get('/', getUserSubscriptions);
router.get('/recent', getRecentSubscriptions);
router.delete('/:id', deleteSubscription);

module.exports = router;
