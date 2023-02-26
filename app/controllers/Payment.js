const PaymentModel = require('../model/payment')

// Create and Save a new payment
exports.create = async (req, res) => {
    if (!req.body.category) {
        res.status(400).send({ message: "Category cannot be empty!" });
    }
    if (!req.body.date) {
        res.status(400).send({ message: "Date cannot be empty!" });
    }    
    if (req.body.date && !isValidDate(req.body.date)) {
        res.status(400).send({ message: "Date must be in yyyy-mm-dd format!" });
    } 
    if (!req.body.amount) {
        res.status(400).send({ message: "Amount cannot be empty!" });
    }
    
    const payment = new PaymentModel({
        category: req.body.category,
        date: req.body.date,
        description: req.body.description,
        note: req.body.note,
        amount: req.body.amount,
    });
    
    await payment.save().then(data => {
        res.send({
            message:"Payment created successfully",
            payment:data
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating payment"
        });
    });
};

// Retrieve all payments from the database.
exports.findAll = async (req, res) => {
    try {
        const payments = await PaymentModel.find();

        //query params
        if(req.query && req.query.year && req.query.month) {
            let year = req.query.year;
            let month = req.query.month;
            
            const filteredPayments = payments.filter(payment => 
                new Date(Date.parse(payment.date)).getFullYear() == year 
             && new Date(Date.parse(payment.date)).getMonth() + 1 == month);   
            
            res.status(200).json(filteredPayments);
        
        } else {
            res.status(200).json(payments);
        }
    } catch(error) {
        res.status(404).json({message: error.message});
    }
};

// Find a single Payment with an id
exports.findOne = async (req, res) => {
    try {
        const payment = await PaymentModel.findById(req.params.id);
        res.status(200).json(payment);
    } catch(error) {
        res.status(404).json({ message: error.message});
    }
};

// Update a payment by the id in the request
exports.update = async (req, res) => {
    if(!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    
    const id = req.params.id;
    
    await PaymentModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Payment not found.`
            });
        }else{
            res.send({ message: "Payment updated successfully." })
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

// Delete a payment with the specified id in the request
exports.destroy = async (req, res) => {
    await PaymentModel.findByIdAndRemove(req.params.id).then(data => {
        if (!data) {
          res.status(404).send({
            message: `Payment not found.`
          });
        } else {
          res.send({
            message: "Payment deleted successfully!"
          });
        }
    }).catch(err => {
        res.status(500).send({
          message: err.message
        });
    });
};

function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
}
  