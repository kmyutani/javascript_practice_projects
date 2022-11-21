const router = require('express').Router();
const {addIncome, addExpenses, viewAllIncome, viewAllExpenses, updateSpecificIncome, updateSpecificExpenses , viewAllTransactions, viewUserTransactions, deleteSpecificIncome, deleteSpecificExpenses, viewSpecificUserTransaction} = require('./../controllers/transactionsControllers');
const { verifyToken, verifyAdmin, verifyUser } = require('./../utils/auth');


router.post('/income', verifyToken, addIncome);

router.post('/expenses', verifyToken, addExpenses);

router.get('/myTransactions', verifyToken, viewUserTransactions);

router.get('/income/all', verifyToken, viewAllIncome);

router.get('/expenses/all', verifyToken, viewAllExpenses);

router.patch('/income/update/:categoryId', verifyToken, updateSpecificIncome);

router.patch('/expenses/update/:categoryId', verifyToken, updateSpecificExpenses);

router.delete('/income/delete/:categoryId', verifyToken, deleteSpecificIncome);

router.delete('/expenses/delete/:categoryId', verifyToken, deleteSpecificExpenses);

router.get('/all', verifyToken, verifyAdmin, viewAllTransactions);

router.get('/all/:userId', verifyToken, verifyAdmin, viewSpecificUserTransaction);

module.exports = router;