const express = require('express')
const PaymentController = require('../controllers/Payment')
const router = express.Router();

router.get('/', PaymentController.findAll);
router.get('/:id', PaymentController.findOne);
router.post('/', PaymentController.create);
router.patch('/:id', PaymentController.update);
router.delete('/:id', PaymentController.destroy);

module.exports = router