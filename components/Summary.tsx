import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Transaction } from '../types';

interface SummaryProps {
    transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#da4167', '#83d4e7'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = <T extends { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; index: number; }>(
    { cx, cy, midAngle, innerRadius, outerRadius, percent }: T
) => {
    if (percent === 0) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export const Summary: React.FC<SummaryProps> = ({ transactions }) => {
    const { totalIncome, totalExpenses, balance, expenseCategoryData } = useMemo(() => {
        let totalIncome = 0;
        let totalExpenses = 0;
        const categoryMap = new Map<string, number>();

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpenses += transaction.amount;
                const currentAmount = categoryMap.get(transaction.category) || 0;
                categoryMap.set(transaction.category, currentAmount + transaction.amount);
            }
        });

        const balance = totalIncome - totalExpenses;
        const expenseCategoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
            name,
            value
        })).sort((a,b) => b.value - a.value);

        return { totalIncome, totalExpenses, balance, expenseCategoryData };
    }, [transactions]);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
             <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <h2 className="text-sm font-medium text-green-500 dark:text-green-400">Total Income</h2>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                 <div>
                    <h2 className="text-sm font-medium text-red-500 dark:text-red-400">Total Expenses</h2>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
            <div>
                <h2 className="text-lg font-medium text-slate-500 dark:text-slate-400 text-center">Net Balance</h2>
                <p className={`text-4xl font-bold text-center ${balance >= 0 ? 'text-slate-800 dark:text-slate-100' : 'text-red-500 dark:text-red-400'}`}>
                    ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            <hr className="border-slate-200 dark:border-slate-700"/>
            <div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Expense Breakdown</h3>
                {expenseCategoryData.length > 0 ? (
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={expenseCategoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {expenseCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-48 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400">No expense data for chart</p>
                    </div>
                )}
            </div>
        </div>
    );
};
