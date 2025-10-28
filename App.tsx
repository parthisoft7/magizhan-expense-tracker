import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Transaction } from './types';
import { Header } from './components/Header';
import { Summary } from './components/Summary';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { GeminiAnalysis } from './components/GeminiAnalysis';
import { analyzeTransactions } from './services/geminiService';

const App: React.FC = () => {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...newTransactionData,
            id: Date.now().toString(),
        };
        setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    };

    const handleDeleteTransaction = (id: string) => {
        setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction.id !== id));
    };

    const handleAnalyzeTransactions = useCallback(async () => {
        setIsLoadingAnalysis(true);
        setAnalysisError(null);
        setAnalysis(null);
        try {
            const result = await analyzeTransactions(transactions);
            setAnalysis(result);
        } catch (error) {
            if (error instanceof Error) {
                setAnalysisError(error.message);
            } else {
                setAnalysisError("An unknown error occurred.");
            }
        } finally {
            setIsLoadingAnalysis(false);
        }
    }, [transactions]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Header />
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left/Top column */}
                    <div className="lg:col-span-2 space-y-8">
                        <ExpenseForm onAddTransaction={handleAddTransaction} />
                        <ExpenseList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
                    </div>
                    {/* Right/Bottom column */}
                    <div className="lg:col-span-1 space-y-8">
                        <Summary transactions={transactions} />
                        <GeminiAnalysis 
                            analysis={analysis} 
                            isLoading={isLoadingAnalysis} 
                            error={analysisError} 
                            onAnalyze={handleAnalyzeTransactions}
                            hasTransactions={transactions.length > 0}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
