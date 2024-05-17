const express = require('express');
const MarketingController = require('../controllers/MarketingController');

const router = express.Router();

router.get('/promotions', MarketingController.getPromotions);
router.get('/banners', MarketingController.getBanners);
router.get('/contact-detail', MarketingController.getContactDetail);
router.get('/payment-detail', MarketingController.getPaymentDetail);
router.get('/cancel-reasons', MarketingController.getCancelReasons);
router.get('/banks', MarketingController.getBanks);
router.get('/percentage', MarketingController.getPercentage);

module.exports = router;