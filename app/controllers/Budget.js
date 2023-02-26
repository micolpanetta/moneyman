const BudgetModel = require('../model/budget')

// Create and Save a new budget
exports.create = async (req, res) => {
    if (!req.body.category) {
        res.status(400).send({ message: "Category cannot be empty!" });
    }
    if (!req.body.year) {
        res.status(400).send({ message: "Year cannot be empty!" });
    }    
    if (!req.body.period || (req.body.period !== 'monthly' || req.body.period !== 'annual')) {
        res.status(400).send({ message: "Period must be 'monthly' or 'annual'!" });
    } 
    if (!req.body.amount) {
        res.status(400).send({ message: "Amount cannot be empty!" });
    }
    
    const budget = new BudgetModel({
        category: req.body.category,
        year: req.body.year,
        month: req.body.month,
        period: req.body.period,
        amount: req.body.amount,
    });
    
    await budget.save().then(data => {
        res.send({
            message:"Budget created successfully",
            budget:data
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating budget"
        });
    });
};

// Retrieve all budgets from the database.
exports.findAll = async (req, res) => {
    try {
        const budgets = await BudgetModel.find();

        //query params
        if(req.query && req.query.year && !req.query.month) {
            let year = req.query.year;
          
            const filteredBudgets = budgets.filter(budget => 
                budget.year == year);   
            
            res.status(200).json(filteredBudgets);
        
        } else if(req.query && req.query.year && req.query.month) {
            let year = req.query.year;
            let month = req.query.month;
            
            const filteredBudgets = budgets.filter(budget => 
                budget.year == year 
             && budget.month == month);   
            
            res.status(200).json(filteredBudgets);
        
        } else {
            res.status(200).json(budgets);
        }
    } catch(error) {
        res.status(404).json({message: error.message});
    }
};

// Find a single Budget with an id
exports.findOne = async (req, res) => {
    try {
        const budget = await BudgetModel.findById(req.params.id);
        res.status(200).json(budget);
    } catch(error) {
        res.status(404).json({ message: error.message});
    }
};

// Update a budget by the id in the request
exports.update = async (req, res) => {
    if(!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    
    const id = req.params.id;
    
    await BudgetModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Budget not found.`
            });
        }else{
            res.send({ message: "Budget updated successfully." })
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

// Delete a budget with the specified id in the request
exports.destroy = async (req, res) => {
    await BudgetModel.findByIdAndRemove(req.params.id).then(data => {
        if (!data) {
          res.status(404).send({
            message: `Budget not found.`
          });
        } else {
          res.send({
            message: "Budget deleted successfully!"
          });
        }
    }).catch(err => {
        res.status(500).send({
          message: err.message
        });
    });
};
  