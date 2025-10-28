import React, { useState } from 'react';
import { Transaction } from '../types';

interface TransactionFormProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const EXPENSE_CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];
const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const ACCOUNTS = ["GPay", "Cash", "Other"];

export const ExpenseForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
    const [account, setAccount] = useState(ACCOUNTS[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const handleTypeChange = (newType: 'income' | 'expense') => {
        setType(newType);
        setCategory(newType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !date || !category || !account) {
            setError('All fields are required.');
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }
        setError('');

        onAddTransaction({
            description,
            amount: parseFloat(amount),
            category,
            date,
            type,
            account
        });

        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
    };
    
    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Add New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Transaction Type */}
                <div className="flex rounded-md shadow-sm">
                    <button type="button" onClick={() => handleTypeChange('expense')} className={`relative inline-flex items-center justify-center w-1/2 px-4 py-2 rounded-l-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors ${type === 'expense' ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                        Expense
                    </button>
                    <button type="button" onClick={() => handleTypeChange('income')} className={`-ml-px relative inline-flex items-center justify-center w-1/2 px-4 py-2 rounded-r-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors ${type === 'income' ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                        Income
                    </button>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-slate-800 dark:text-slate-200"
                        placeholder={type === 'expense' ? 'e.g. Lunch with colleagues' : 'e.g. Monthly Salary'}
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount (₹)</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-slate-800 dark:text-slate-200"
                        placeholder="1500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-slate-800 dark:text-slate-200"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="account" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Account</label>
                        <select
                            id="account"
                            value={account}
                            onChange={(e) => setAccount(e.target.value as 'GPay'|'Cash'|'Other')}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-slate-800 dark:text-slate-200"
                        >
                            {ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-slate-800 dark:text-slate-200"
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                    Add Transaction
                </button>
            </form>
        </div>
    );
};
