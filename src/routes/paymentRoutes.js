const express = require('express');
const PaymentController = require('../controllers/PaymentController');
const { verifyToken } = require('../utils/authUtils');
const paginationMiddleware = require('../middleware/paginationMiddleware');
const router = express.Router()

// Route for creating a Payment
router.post('/create', PaymentController.createPayment);
router.post('/my-payments', PaymentController.getAllPaymentForUser);
router.get('/:id', PaymentController.getPaymentById);
router.get('/', paginationMiddleware, PaymentController.getAllPayments);
router.put('/update', PaymentController.updatePaymentById);
router.delete('/delete', PaymentController.deletePaymentById);
router.post('/withdrawal', PaymentController.createWithdrawal);
router.post('/deposit', PaymentController.createDeposit);

module.exports = router;
