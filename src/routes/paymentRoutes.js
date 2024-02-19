const express = require('express');
const PaymentController = require('../controllers/PaymentController');
const { verifyToken } = require('../utils/authUtils');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const router = express.Router()

// Route for creating a Payment
router.post('/create', PaymentController.createPayment);
router.post('/my-payments', PaymentController.getAllPaymentForUser);
router.get('/all-withdraw', PaymentController.getAllWithdraw);
router.get('/all-deposit', PaymentController.getAllDeposit);
router.get('/:id', PaymentController.getPaymentById);
router.get('/', PaymentController.getAllPayments);
router.put('/update', PaymentController.updatePaymentById);
router.delete('/delete', PaymentController.deletePaymentById);
router.post('/withdraw', uploadMiddleware([{ name: 'image', maxCount: 1 }]), PaymentController.createWithdraw);
router.post('/deposit', uploadMiddleware([{ name: 'image', maxCount: 1 }]), PaymentController.createDeposit);
router.put('/update-withdraw', PaymentController.updateWithdraw);
router.put('/update-deposit', PaymentController.updateDeposit);


module.exports = router;
