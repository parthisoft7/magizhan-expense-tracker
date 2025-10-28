import React from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
    transactions: Transaction[];
    onDeleteTransaction: (id: string) => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

export const ExpenseList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Recent Transactions</h2>
            <div className="max-h-[300px] overflow-y-auto pr-2">
                {sortedTransactions.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">No transactions yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {sortedTransactions.map(transaction => (
                            <li key={transaction.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{transaction.description}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{transaction.category} &middot; {transaction.account} &middot; {new Date(transaction.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-4 ml-4">
                                    <p className={`text-sm font-semibold whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                      {transaction.type === 'income' ? '+' : ''}₹{transaction.amount.toLocaleString('en-IN')}
                                    </p>
                                    <button
                                        onClick={() => onDeleteTransaction(transaction.id)}
                                        className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded-full p-1"
                                        aria-label="Delete transaction"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
