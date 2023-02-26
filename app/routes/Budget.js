const express = require('express')
const BudgetController = require('../controllers/Budget')
const router = express.Router();

router.get('/', BudgetController.findAll);
router.get('/:id', BudgetController.findOne);
router.post('/', BudgetController.create);
router.patch('/:id', BudgetController.update);
router.delete('/:id', BudgetController.destroy);

module.exports = router