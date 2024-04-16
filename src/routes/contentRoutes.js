const express = require('express');
const refundPolicyData = require('../content/Cancelationdata');
const cancelationPolicyData = require('../content/Cancelationdata');
const TermsData = require('../content/Terms');
const policyData = require('../content/Policy');
const router = express.Router();

router.get('/refund', (req, res) => {
    res.json({
        success: true,
        message: 'Refund policy data fetched successfully',
        data: refundPolicyData,
    });
});
router.get('/cancelation', (req, res) => {
    res.json({
        success: true,
        message: 'Cancelation policy data fetched successfully',
        data: cancelationPolicyData,
    });
});
router.get('/terms', (req, res) => {
    res.json({
        success: true,
        message: 'Terms and condition data fetched successfully',
        data: TermsData,
    });
});
router.get('/policy', (req, res) => {
    res.json({
        success: true,
        message: 'Privacy policy data fetched successfully',
        data: policyData,
    });
});


module.exports = router;