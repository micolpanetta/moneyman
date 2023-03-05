const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const PaymentRoute = require('./app/routes/Payment');
app.use('/payment', PaymentRoute);

const BudgetRoute = require('./app/routes/Budget');
app.use('/budget', BudgetRoute);

const TransactionRoute = require('./app/routes/Transaction');
app.use('/transaction', TransactionRoute);

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.get('/', (req, res) => {
    res.json({"message": "Hello Crud Node Express"});
});

app.listen(80, () => {
    console.log("Server is listening on port 80");
});