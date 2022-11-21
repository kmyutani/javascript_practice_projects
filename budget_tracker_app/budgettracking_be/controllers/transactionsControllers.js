const Transaction = require('./../models/Transactions');
const Category = require('./../models/Categories');

// @path        api/transactions/income 
// @method      POST
// @desc        Post users Income
// @privacy     NORMAL USER
// @body
    // income     category
// @return      Details of the user income transaction
module.exports.addIncome = async (req, res, next) =>{
    
    try {
        
        const incomeBody = {
            categoryId: req.body.categoryId,
            income: req.body.income
        };

        const transactionDetails = await Transaction.findOne({userId: req.user._id});
        if (transactionDetails === null) {

            const transaction = new Transaction({
                userId: req.user._id,
                amount: req.body.income
            });

            await transaction.save();
            
            const userTransaction = await Transaction.findOne({userId: req.user._id});
            await userTransaction.incomeTransactions.push(incomeBody);

            await userTransaction.save();

            res.status(201).send(userTransaction);

        } else {

            const userTransaction = await Transaction.findOne({userId: req.user._id});

            const searchSimilarCategory = await userTransaction.incomeTransactions.some(transaction =>{
                return transaction.categoryId.equals(req.body.categoryId);
            });
            // console.log(searchSimilarCategory);
            if (searchSimilarCategory === false) {

                userTransaction.amount += req.body.income;

                await userTransaction.incomeTransactions.push(incomeBody);
                await userTransaction.save();

                res.status(201).send(userTransaction);

            } else {

                userTransaction.amount += req.body.income;
                await userTransaction.save();
                
                const sameCategory = await userTransaction.incomeTransactions.filter(transaction =>{
                    return transaction.categoryId == req.body.categoryId;
                });

                let updatedIncome = sameCategory[0].income + req.body.income;
                
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id, incomeTransactions: {"$elemMatch": {categoryId: req.body.categoryId }}}, {"$set": {"incomeTransactions.$.income": updatedIncome}}, 
                    {new: true}
                );

                res.status(201).send(updatedUserTransaction)

            }

        }

    } catch (err) {

        next(err);
        
    };
};

// @path        api/transactions/expenses
// @method      POST
// @desc        Post users Expenses
// @privacy     NORMAL USER
// @body
    // expense    category
// @return      Details of the user expenses transaction
module.exports.addExpenses = async (req, res, next) =>{
    
    try {

        const expenses = req.body.expenses * -1;

        const expensesBody = {
            categoryId: req.body.categoryId,
            expenses: expenses
        };

        const transactionDetails = await Transaction.findOne({userId: req.user._id});
        if (transactionDetails === null) {

            const transaction = new Transaction({
                userId: req.user._id,
                amount: expenses
            });

            await transaction.save();
            
            const userTransaction = await Transaction.findOne({userId: req.user._id});
            await userTransaction.expensesTransaction.push(expensesBody);

            await userTransaction.save();

            res.status(201).send(userTransaction);

        } else {

            const userTransaction = await Transaction.findOne({userId: req.user._id});

            const searchSimilarCategory = await userTransaction.expensesTransaction.some(transaction =>{
                return transaction.categoryId.equals(req.body.categoryId);
            });

            if (searchSimilarCategory === false) {

                userTransaction.amount += expenses;

                await userTransaction.expensesTransaction.push(expensesBody);
                await userTransaction.save();

                res.status(201).send(userTransaction);

            } else {

                userTransaction.amount += expenses;
                await userTransaction.save();
         
                const sameCategory = await userTransaction.expensesTransaction.filter(transaction =>{
                    return transaction.categoryId == req.body.categoryId;
                });

                let updatedExpenses = sameCategory[0].expenses + expenses;
                
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id, expensesTransaction: {"$elemMatch": {categoryId: req.body.categoryId }}}, {"$set": {"expensesTransaction.$.expenses": updatedExpenses}}, 
                    {new: true}
                );

                res.status(201).send(updatedUserTransaction)

            }

        }

    } catch (err) {

        next(err);
        
    };
};

// @path        api/transactions/myTransactions
// @method      GET
// @desc        View all transactions in database associated with the user
// @privacy     NORMAL USER
// @return      Details of the all transactions
module.exports.viewUserTransactions = async (req, res, next) =>{

    try {
        
        const searchUserTransactions = await Transaction.findOne(
            {userId: req.user._id},
            {userId:0, __v:0}
        ).populate("incomeTransactions.categoryId").populate("expensesTransaction.categoryId");

        res.send(searchUserTransactions)
        
    } catch (err) {
        
        next(err);

    };
};

// @path        api/transactions/income/all
// @method      GET
// @desc        View all income transactions in database
// @privacy     NORMAL USER
// @return      Details of the all income transactions
module.exports.viewAllIncome = async (req, res, next) =>{

    try {
        
        const searchIncomeTransactions = await Transaction.findOne(
            {userId: req.user._id},
            {expensesTransaction:0, userId:0, _id:0, __v:0}
        );

        res.send(searchIncomeTransactions)

    } catch (err) {
        
        next(err);

    };
};

// @path        api/transactions/expenses/all
// @method      GET
// @desc        View all expenses transaction in database
// @privacy     NORMAL USER
// @return      Details of the all expenses transaction
module.exports.viewAllExpenses = async (req, res, next) =>{

    try {
        
        const searchExpensesTransaction = await Transaction.findOne(
            {userId: req.user._id},
            {incomeTransactions:0, userId:0, _id:0, __v:0}
        );

        res.send(searchExpensesTransaction)
        
    } catch (err) {
        
        next(err);

    };
};

// @path        api/transactions/income/update/:categoryId  
// @method      PATCH
// @desc        Update the income
// @privacy     NORMAL USER
// @body  
    // categoryId     Income
// @return      Details of the updated income
module.exports.updateSpecificIncome = async (req, res, next) =>{
    
    try {
        
        if (req.body.income != undefined) {
            
            const searchCategory = await Transaction.findOne(
                {userId: req.user._id, incomeTransactions: {"$elemMatch": {categoryId: req.params.categoryId }}})
            if (!searchCategory) throw new Error("You don't have an existing transaction with this category")

            await Transaction.findOneAndUpdate(
                {userId: req.user._id, incomeTransactions: {"$elemMatch": {categoryId: req.params.categoryId }}}, {"$set": {"incomeTransactions.$.income": req.body.income}}, 
                {new: true}
            );

            const searchUser = await Transaction.findOne({userId: req.user._id});
            
            if (searchUser.incomeTransactions.length === 0) {
            
                const newAmountIncome = 0;
                if (searchUser.expensesTransaction.length === 0) {
    
                    const newAmountExpenses = 0
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
                } else if (searchUser.expensesTransaction.length === 1) {
    
                    const newAmountExpenses = searchUser.expensesTransaction[0].expenses
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
    
                } else {
    
                    const newAmountExpenses = searchUser.expensesTransaction.reduce(
                        (a,b) => ({expenses: a.expenses + b.expenses})
                    )
                    const newTotal =  newAmountIncome + newAmountExpenses.expenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
                };
            } else if (searchUser.expensesTransaction.length === 0) {
                
                const newAmountExpenses = 0;
    
                if (searchUser.incomeTransactions.length === 0) {
    
                    const newAmountIncome = 0
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
    
                } else if (searchUser.incomeTransactions.length === 1) {
    
                    const newAmountIncome = searchUser.incomeTransactions[0].income
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
    
                } else {
    
                    const newAmountIncome = searchUser.incomeTransactions.reduce(
                        (a,b) => ({income: a.income + b.income})
                    )
                    const newTotal =  newAmountIncome.income + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
                };
            } else if (searchUser.incomeTransactions.length === 1) {
                
                const newAmountIncome = searchUser.incomeTransactions[0].income;
                
                if (searchUser.expensesTransaction.length === 1) {
                    
                    const newAmountExpenses = searchUser.expensesTransaction[0].expenses
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
    
                } else {
                    
                    const newAmountExpenses = searchUser.expensesTransaction.reduce(
                        (a,b) => ({expenses: a.expenses + b.expenses})
                    )
                    
                    const newTotal =  newAmountIncome + newAmountExpenses.expenses
                    
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
                };
    
            } else if (searchUser.expensesTransaction.length === 1) {
    
                const newAmountExpenses = searchUser.expensesTransaction[0].expenses
    
                const newAmountIncome = searchUser.incomeTransactions.reduce(
                    (a,b) => ({income: a.income + b.income})
                );
                
                const newTotal =  newAmountIncome.income + newAmountExpenses
    
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
    
            } else {
    
                const newAmountIncome = searchUser.incomeTransactions.reduce(
                    (a,b) => ({income: a.income + b.income})
                );
        
                const newAmountExpenses = searchUser.expensesTransaction.reduce(
                    (a,b) => ({expenses: a.expenses + b.expenses})
                )
        
                const newTotal =  newAmountIncome.income + newAmountExpenses.expenses
        
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            };

        } else {
            
            const searchCategory = await Category.findById(req.body.categoryId);
            if (!searchCategory) {
                
                res.send({Error: "Enter an existing category"});

            } else {

                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id, incomeTransactions: {"$elemMatch": {categoryId: req.params.categoryId }}}, {"$set": {"incomeTransactions.$.categoryId": req.body.categoryId}}, 
                    {new: true}
                );
    
                res.send(updatedUserTransaction)
            }
        }
        
    } catch (err) {
        
        next(err);

    };
};

// @path        api/transactions/expenses/update/:categoryId  
// @method      PATCH
// @desc        Update the expenses
// @privacy     NORMAL USER
// @body  
    // categoryId     Expenses
// @return      Details of the updated expenses
module.exports.updateSpecificExpenses = async (req, res, next) =>{
    
    try {
        
        if (req.body.expenses != undefined) {
            
            const searchCategory = await Transaction.findOne(
                {userId: req.user._id, expensesTransaction: {"$elemMatch": {categoryId: req.params.categoryId }}})
            if (!searchCategory) throw new Error("You don't have an existing transaction with this category")
            
            const expenses = req.body.expenses * -1

            await Transaction.findOneAndUpdate(
                {userId: req.user._id, expensesTransaction: {"$elemMatch": {categoryId: req.params.categoryId }}}, {"$set": {"expensesTransaction.$.expenses": expenses}}, 
                {new: true}
            );

            const searchUser = await Transaction.findOne({userId: req.user._id});

            if (searchUser.incomeTransactions.length === 0) {
            
                const newAmountIncome = 0;
                if (searchUser.expensesTransaction.length === 0) {
    
                    const newAmountExpenses = 0
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
                } else if (searchUser.expensesTransaction.length === 1) {
    
                    const newAmountExpenses = searchUser.expensesTransaction[0].expenses
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
    
                } else {
    
                    const newAmountExpenses = searchUser.expensesTransaction.reduce(
                        (a,b) => ({expenses: a.expenses + b.expenses})
                    )
                    const newTotal =  newAmountIncome + newAmountExpenses.expenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
                };
            } else if (searchUser.expensesTransaction.length === 0) {
                
                const newAmountExpenses = 0;
    
                if (searchUser.incomeTransactions.length === 0) {
    
                    const newAmountIncome = 0
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
    
                } else if (searchUser.incomeTransactions.length === 1) {
    
                    const newAmountIncome = searchUser.incomeTransactions[0].income
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
    
                } else {
    
                    const newAmountIncome = searchUser.incomeTransactions.reduce(
                        (a,b) => ({income: a.income + b.income})
                    )
                    const newTotal =  newAmountIncome.income + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
                };
            } else if (searchUser.incomeTransactions.length === 1) {
                
                const newAmountIncome = searchUser.incomeTransactions[0].income;
                
                if (searchUser.expensesTransaction.length === 1) {
                    
                    const newAmountExpenses = searchUser.expensesTransaction[0].expenses
                    const newTotal =  newAmountIncome + newAmountExpenses
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
    
                } else {
                    
                    const newAmountExpenses = searchUser.expensesTransaction.reduce(
                        (a,b) => ({expenses: a.expenses + b.expenses})
                    )
                    
                    const newTotal =  newAmountIncome + newAmountExpenses.expenses
                    
                    const updatedUserTransaction = await Transaction.findOneAndUpdate(
                        {userId: req.user._id},
                        {amount: newTotal},
                        {new: true}
                    );
                    res.send(updatedUserTransaction)
                };
    
            } else if (searchUser.expensesTransaction.length === 1) {
    
                const newAmountExpenses = searchUser.expensesTransaction[0].expenses
    
                const newAmountIncome = searchUser.incomeTransactions.reduce(
                    (a,b) => ({income: a.income + b.income})
                );
                
                const newTotal =  newAmountIncome.income + newAmountExpenses
    
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
    
            } else {
    
                const newAmountIncome = searchUser.incomeTransactions.reduce(
                    (a,b) => ({income: a.income + b.income})
                );
        
                const newAmountExpenses = searchUser.expensesTransaction.reduce(
                    (a,b) => ({expenses: a.expenses + b.expenses})
                )
        
                const newTotal =  newAmountIncome.income + newAmountExpenses.expenses
        
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            };

        } else {
            
            const searchCategory = await Category.findById(req.body.categoryId);
            if (!searchCategory) {
                
                res.send({Error: "Enter an existing category"});

            } else {

                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id, expensesTransaction: {"$elemMatch": {categoryId: req.params.categoryId }}}, {"$set": {"expensesTransaction.$.categoryId": req.body.categoryId}}, 
                    {new: true}
                );
    
                res.send(updatedUserTransaction)
            }
        }
        
    } catch (err) {
        
        next(err);

    };
};

// @path        api/transactions/income/delete/:categoryId  
// @method      DELETE
// @desc        DELETE the income
// @privacy     NORMAL USER
// @return      Details of the deleted income
module.exports.deleteSpecificIncome = async (req, res, next) =>{

    try {

        await Transaction.findOneAndUpdate(
            {userId: req.user._id, incomeTransactions: {"$elemMatch": {categoryId: req.params.categoryId }}}, {"$pull": {incomeTransactions: {categoryId: req.params.categoryId}}}, 
            {new: true}
        );

        const searchUser = await Transaction.findOne({userId: req.user._id});
        
        if (searchUser.incomeTransactions.length === 0) {
            
            const newAmountIncome = 0;
            if (searchUser.expensesTransaction.length === 0) {

                const newAmountExpenses = 0
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            } else if (searchUser.expensesTransaction.length === 1) {

                const newAmountExpenses = searchUser.expensesTransaction[0].expenses
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)

            } else {

                const newAmountExpenses = searchUser.expensesTransaction.reduce(
                    (a,b) => ({expenses: a.expenses + b.expenses})
                )
                const newTotal =  newAmountIncome + newAmountExpenses.expenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            };
        } else if (searchUser.expensesTransaction.length === 0) {
            
            const newAmountExpenses = 0;

            if (searchUser.incomeTransactions.length === 0) {

                const newAmountIncome = 0
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)

            } else if (searchUser.incomeTransactions.length === 1) {

                const newAmountIncome = searchUser.incomeTransactions[0].income
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)

            } else {

                const newAmountIncome = searchUser.incomeTransactions.reduce(
                    (a,b) => ({income: a.income + b.income})
                )
                const newTotal =  newAmountIncome.income + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            };
        } else if (searchUser.incomeTransactions.length === 1) {
            
            const newAmountIncome = searchUser.incomeTransactions[0].income;
            
            if (searchUser.expensesTransaction.length === 1) {
                
                const newAmountExpenses = searchUser.expensesTransaction[0].expenses
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)

            } else {
                
                const newAmountExpenses = searchUser.expensesTransaction.reduce(
                    (a,b) => ({expenses: a.expenses + b.expenses})
                )
                
                const newTotal =  newAmountIncome + newAmountExpenses.expenses
                
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            };

        } else if (searchUser.expensesTransaction.length === 1) {

            const newAmountExpenses = searchUser.expensesTransaction[0].expenses

            const newAmountIncome = searchUser.incomeTransactions.reduce(
                (a,b) => ({income: a.income + b.income})
            );
            
            const newTotal =  newAmountIncome.income + newAmountExpenses

            const updatedUserTransaction = await Transaction.findOneAndUpdate(
                {userId: req.user._id},
                {amount: newTotal},
                {new: true}
            );
            res.send(updatedUserTransaction)

        } else {

            const newAmountIncome = searchUser.incomeTransactions.reduce(
                (a,b) => ({income: a.income + b.income})
            );
    
            const newAmountExpenses = searchUser.expensesTransaction.reduce(
                (a,b) => ({expenses: a.expenses + b.expenses})
            )
    
            const newTotal =  newAmountIncome.income + newAmountExpenses.expenses
    
            const updatedUserTransaction = await Transaction.findOneAndUpdate(
                {userId: req.user._id},
                {amount: newTotal},
                {new: true}
            );
            res.send(updatedUserTransaction)
        };
        
    } catch (err) {
        
        next(err);

    };
}

// @path        api/transactions/expenses/delete/:categoryId  
// @method      DELETE
// @desc        DELETE the expenses
// @privacy     NORMAL USER
// @return      Details of the deleted expenses
module.exports.deleteSpecificExpenses = async (req, res, next) =>{

    try {

        await Transaction.findOneAndUpdate(
            {userId: req.user._id, expensesTransaction: {"$elemMatch": {categoryId: req.params.categoryId }}}, {"$pull": {expensesTransaction: {categoryId: req.params.categoryId}}}, 
            {new: true}
        );

        const searchUser = await Transaction.findOne({userId: req.user._id});
        
        if (searchUser.incomeTransactions.length === 0) {
            
            const newAmountIncome = 0;
            if (searchUser.expensesTransaction.length === 0) {

                const newAmountExpenses = 0
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            } else if (searchUser.expensesTransaction.length === 1) {

                const newAmountExpenses = searchUser.expensesTransaction[0].expenses
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)

            } else {

                const newAmountExpenses = searchUser.expensesTransaction.reduce(
                    (a,b) => ({expenses: a.expenses + b.expenses})
                )
                const newTotal =  newAmountIncome + newAmountExpenses.expenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            };
        } else if (searchUser.expensesTransaction.length === 0) {
            
            const newAmountExpenses = 0;

            if (searchUser.incomeTransactions.length === 0) {

                const newAmountIncome = 0
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)

            } else if (searchUser.incomeTransactions.length === 1) {

                const newAmountIncome = searchUser.incomeTransactions[0].income
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)

            } else {

                const newAmountIncome = searchUser.incomeTransactions.reduce(
                    (a,b) => ({income: a.income + b.income})
                )
                const newTotal =  newAmountIncome.income + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            };
        } else if (searchUser.incomeTransactions.length === 1) {
            
            const newAmountIncome = searchUser.incomeTransactions[0].income;
            
            if (searchUser.expensesTransaction.length === 1) {
                
                const newAmountExpenses = searchUser.expensesTransaction[0].expenses
                const newTotal =  newAmountIncome + newAmountExpenses
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)

            } else {
                
                const newAmountExpenses = searchUser.expensesTransaction.reduce(
                    (a,b) => ({expenses: a.expenses + b.expenses})
                )
                
                const newTotal =  newAmountIncome + newAmountExpenses.expenses
                
                const updatedUserTransaction = await Transaction.findOneAndUpdate(
                    {userId: req.user._id},
                    {amount: newTotal},
                    {new: true}
                );
                res.send(updatedUserTransaction)
            };

        } else if (searchUser.expensesTransaction.length === 1) {

            const newAmountExpenses = searchUser.expensesTransaction[0].expenses

            const newAmountIncome = searchUser.incomeTransactions.reduce(
                (a,b) => ({income: a.income + b.income})
            );
            
            const newTotal =  newAmountIncome.income + newAmountExpenses

            const updatedUserTransaction = await Transaction.findOneAndUpdate(
                {userId: req.user._id},
                {amount: newTotal},
                {new: true}
            );
            res.send(updatedUserTransaction)

        } else {

            const newAmountIncome = searchUser.incomeTransactions.reduce(
                (a,b) => ({income: a.income + b.income})
            );
    
            const newAmountExpenses = searchUser.expensesTransaction.reduce(
                (a,b) => ({expenses: a.expenses + b.expenses})
            )
    
            const newTotal =  newAmountIncome.income + newAmountExpenses.expenses
    
            const updatedUserTransaction = await Transaction.findOneAndUpdate(
                {userId: req.user._id},
                {amount: newTotal},
                {new: true}
            );
            res.send(updatedUserTransaction)
        };
        
        
    } catch (err) {
        
        // next(err);
        res.send(err)

    };

}

// @path        api/transactions/all
// @method      GET
// @desc        View all transactions in database
// @privacy     Dev
// @return      Details of the all transactions
module.exports.viewAllTransactions = async (req, res, next) =>{

    try {
        
        const searchTransactions = await Transaction.find({}, {__v:0})

        res.send(searchTransactions);

    } catch (err) {
        
        next(err);

    };
};

// @path        api/transactions/all/:userId
// @method      GET
// @desc        View all transactions in database
// @privacy     Dev
// @return      Details of the all transactions
module.exports.viewSpecificUserTransaction = async (req, res, next) =>{

    try {

        const searchUserTransactions = await Transaction.findOne(
            {userId: req.params.userId},
            {__v:0}
        );

        res.send(searchUserTransactions)

    } catch (err) {
        
        next(err);

    };
};