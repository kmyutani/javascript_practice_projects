import React, {useContext} from 'react'
import { Pie} from 'react-chartjs-2';
import { ApplicationContext} from './../../contexts/ApplicationContext';

export default function IncomeChart() {

    const {transactionDetails} = useContext(ApplicationContext);

    let totalIncome = 0
    let totalExpenses = 0
    let incomeTransactions = [];
    let expensesTransaction = [];

    if (transactionDetails.incomeTransactions !== undefined) {
        incomeTransactions = transactionDetails.incomeTransactions
    };

    if (transactionDetails.expensesTransaction !== undefined){
        expensesTransaction = transactionDetails.expensesTransaction
    };

    if (incomeTransactions.length === 0) {
            
        totalIncome = 0;

    } else if (incomeTransactions.length === 1) {
        
        totalIncome = incomeTransactions[0].income;

    } else {

        const reducedTotal = incomeTransactions.reduce(
            (a,b) => ({income: a.income + b.income})
        );

        totalIncome = reducedTotal.income
    };

    if (expensesTransaction.length === 0) {
            
        totalExpenses = 0;

    } else if (expensesTransaction.length === 1) {
       
        totalExpenses = expensesTransaction[0].expenses;

    } else {

        const reducedTotal = expensesTransaction.reduce(
            (a,b) => ({expenses: a.expenses + b.expenses})
        );

        totalExpenses = reducedTotal.expenses
    };

    return (
        <div className="chart">
            <Pie
                data={{
                    labels: ['Expenses', 'Income'],
                    datasets: [
                    {
                        label: 'Transaction Summary',
                        data: [totalExpenses, totalIncome],
                        backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        ],
                        borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 1,
                    },
                    ],
                }}
                height={400}
                width={600}
                options={{
                    maintainAspectRatio: false,
                    scales: {
                    yAxes: [
                        {
                        ticks: {
                            beginAtZero: true,
                        },
                        },
                    ],
                    },
                    legend: {
                    labels: {
                        fontSize: 25,
                    },
                    },
                }}
            />
        </div>
    )
}


