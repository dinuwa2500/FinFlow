const Brand = require('../models/Brand');

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({
      success: true,
      data: brands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({
      success: true,
      data: brand
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
