const express = require('express')
const TransactionController = require('../controllers/Transaction')
const router = express.Router();

router.get('/monthly', TransactionController.findAllMonthly);
router.get('/annual', TransactionController.findAllAnnual);

module.exports = router