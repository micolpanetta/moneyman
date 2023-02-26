const budget = require('../model/budget');
const BudgetModel = require('../model/budget');
const payment = require('../model/payment');
const PaymentModel = require('../model/payment');
const transaction = require('../model/transaction');
const TransactionModel = require('../model/transaction')

// Retrieve all monthly transactions from the database.
exports.findAllMonthly = async (req, res) => {
    try {
        
        const payments = await PaymentModel.find();
        const budgets = await BudgetModel.find();

        let monthlyTransactions = [];

        if(req.query && req.query.year && req.query.month) {
            let year = req.query.year;
            let month = req.query.month;
            
            const annualBudgetsCategories = budgets.filter(budget => 
                budget.year == year 
                    && budget.period == 'annual').map(budget => budget.category);   

            const filteredPayments = payments.filter(payment => 
                new Date(Date.parse(payment.date)).getFullYear() == year 
                    && new Date(Date.parse(payment.date)).getMonth() + 1 == month
                        && !annualBudgetsCategories.includes(payment.category)); 

            const paymentsCategories = filteredPayments.map(payment => payment.category);    
            
            const monthlyBudgets = budgets.filter(budget => 
                budget.year == year 
                    && budget.month == month && budget.period == 'monthly'); 

            const monthlyBudgetsCategories = monthlyBudgets.map(budget => budget.category); 
            
            const allCategories = [...new Set([...paymentsCategories, ...monthlyBudgetsCategories])];                 
                    
            monthlyTransactions = allCategories.map(

                categoryName => {
                    
                    const budget = monthlyBudgets.find(budget => budget.category == categoryName);
                    const payments = filteredPayments
                                                .filter(payment => payment.category == categoryName)
                                                .map(payment => ({
                                                    "id": payment.id,
                                                    "category": payment.category,
                                                    "day": new Date(Date.parse(payment.date)).getDate(),
                                                    "description": payment.description,
                                                    "note": payment.note,
                                                    "amount": payment.amount,
                                                }))
                                                .sort((a,b) => a["day"] - b["day"]);
                    const totalAmount = payments.map(payment => payment.amount).reduce((a,b) => a + b, 0);                  
                    
                    return {     
                        "category": categoryName,
                        "budget": budget ? budget.amount : null,
                        "total_amount": -totalAmount,
                        "payments": payments
                    }
                }
            );    
            
            res.status(200).json({"categories": monthlyTransactions, "total": -filteredPayments.map(payment => payment.amount).reduce((a,b) => a + b, 0)});
        
        } else {
            res.status(200).json(monthlyTransactions);
        }
    
    } catch(error) {
        res.status(404).json({message: error.message});
    }
};

// Retrieve all annual transactions from the database.
exports.findAllAnnual = async (req, res) => {
    try {
        
        const payments = await PaymentModel.find();
        const budgets = await BudgetModel.find();

        let annualTransactions = [];

        if(req.query && req.query.year) {
            let year = req.query.year;

            const annualBudgets = budgets.filter(budget => 
                budget.year == year 
                    && budget.period == 'annual'); 
                      
            const annualBudgetsCategories = annualBudgets.map(budget => budget.category);   

            const filteredPayments = payments.filter(payment => 
                new Date(Date.parse(payment.date)).getFullYear() == year 
                    && annualBudgetsCategories.includes(payment.category)); 
            
            annualTransactions = annualBudgetsCategories.map(

                categoryName => {
                    
                    const budget = annualBudgets.find(budget => budget.category == categoryName);
                    const payments = filteredPayments
                                                .filter(payment => payment.category == categoryName)
                                                .map(payment => ({
                                                    "id": payment.id,
                                                    "category": payment.category,
                                                    "day": new Date(Date.parse(payment.date)).getDate(),
                                                    "month": new Date(Date.parse(payment.date)).getMonth() + 1,
                                                    "description": payment.description,
                                                    "note": payment.note,
                                                    "amount": payment.amount,
                                                }))
                                                .sort((a,b) => a["month"] - b["month"])
                                                .sort((a,b) => a["day"] - b["day"]);
                    const totalAmount = payments.map(payment => payment.amount).reduce((a,b) => a + b, 0);                  
                    
                    return {     
                        "category": categoryName,
                        "budget": budget ? budget.amount : null,
                        "total_amount": -totalAmount,
                        "payments": payments
                    }
                }
            );    
            
            res.status(200).json({"categories": annualTransactions, "total": -filteredPayments.map(payment => payment.amount).reduce((a,b) => a + b, 0)});
        
        } else {
            res.status(200).json(annualTransactions);
        }
    
    } catch(error) {
        res.status(404).json({message: error.message});
    }
};