import React from 'react';

interface GeminiAnalysisProps {
    analysis: string | null;
    isLoading: boolean;
    error: string | null;
    onAnalyze: () => void;
    hasTransactions: boolean;
}

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
);

export const GeminiAnalysis: React.FC<GeminiAnalysisProps> = ({ analysis, isLoading, error, onAnalyze, hasTransactions }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">AI Financial Assistant</h2>
                <button
                    onClick={onAnalyze}
                    disabled={isLoading || !hasTransactions}
                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    <SparklesIcon />
                    {isLoading ? 'Analyzing...' : 'Analyze Transactions'}
                </button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg min-h-[150px] flex items-center justify-center">
                {isLoading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : analysis ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
                ) : (
                     <p className="text-slate-500 dark:text-slate-400 text-center">
                        {hasTransactions ? "Click 'Analyze Transactions' to get AI-powered insights on your finances." : "Add some transactions to enable AI analysis."}
                    </p>
                )}
            </div>
        </div>
    );
};
