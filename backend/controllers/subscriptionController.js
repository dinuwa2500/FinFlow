const Subscription = require('../models/Subscription');

// Helper to fetch logo from name
const getLogoUrl = async (name) => {
  const cleanName = name.toLowerCase().trim().replace(/\s+/g, '');

  try {
    const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(name)}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const domain = data[0].domain;
        const logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
       
        return logo;
      }
    }


    const guessedLogo = `https://www.google.com/s2/favicons?domain=${cleanName}.com&sz=128`;
   
    return guessedLogo;

  } catch (error) {
    console.error('[LogoFetch] Error:', error.message);
  }

  // Fallback: Colorful Avatar
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`;
  
  return fallback;
};

exports.createSubscription = async (req, res) => {
  try {
    const { name, amount, billingCycle, category, nextBillingDate } = req.body;
    
    // Auto-fetch logo
    const logo = await getLogoUrl(name);

    // [New] Automatically add to Brands for general expense tracking too
    try {
      const Brand = require('../models/Brand');
      const existingBrand = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (!existingBrand) {
        await Brand.create({ name, logoUrl: logo });
        console.log(`[LogoSync] Automatically added new brand: ${name}`);
      }
    } catch (brandErr) {
      console.error('[LogoSync] Failed to sync brand:', brandErr.message);
    }

    const subscription = await Subscription.create({
      user: req.user.id,
      name,
      amount,
      billingCycle,
      category,
      nextBillingDate,
      logo
    });

    res.status(201).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getRecentSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);
    res.status(200).json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
