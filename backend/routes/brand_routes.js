const express = require('express');
const router = express.Router();
const { getAllBrands, addBrand } = require('../controllers/brandController');

router.get('/', getAllBrands);
router.post('/', addBrand);

module.exports = router;
