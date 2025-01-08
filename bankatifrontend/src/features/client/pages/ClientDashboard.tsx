import { useState, useEffect } from 'react';
import {walletService} from "../../../services/wallet.service";

interface Transaction {
    id: number;
    walletId: string;
    amount: number;
    type: string;
    timestamp: string;
}

interface VirtualCard {
    number: string;
    holder: string;
    expires: string;
    type: 'visa' | 'mastercard' | 'amex';
}

export function ClientDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [wallet, setWallet] = useState({ balance: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [virtualCards] = useState<VirtualCard[]>([
        { number: 'XXXX XXXX XXXX 1234', holder: 'JOHN DOE', expires: '12/25', type: 'visa' },
        { number: 'XXXX XXXX XXXX 0004', holder: 'JANE SMITH', expires: '06/26', type: 'mastercard' },
        { number: 'XXXX XXXX XXXX 0005', holder: 'ROBERT BROWN', expires: '09/27', type: 'amex' },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [walletData, transactionsData] = await Promise.all([
                    walletService.getWallet(),
                    walletService.getTransactions()
                ]);

                setWallet(walletData);
                setTransactions(transactionsData);
            } catch (err) {
                setError('Failed to fetch wallet data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-6">{error}</div>;

    const lastTransaction = transactions[0] || null;

    return (
        <div className="container mx-auto p-6">
            <div className="space-y-6">
                {/* E-Wallet Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">E-Wallet</h2>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-sm text-gray-600">Balance</div>
                            <div className="text-4xl font-bold">${wallet.balance.toFixed(2)}</div>
                        </div>
                        {lastTransaction && (
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Last Transaction</div>
                                <div className={`text-xl font-semibold ${
                                    lastTransaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                                }`}>
                                    ${Math.abs(lastTransaction.amount).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {new Date(lastTransaction.timestamp).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Transactions Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">DATE</th>
                                <th className="text-left py-3 px-4">TYPE</th>
                                <th className="text-right py-3 px-4">AMOUNT</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b">
                                    <td className="py-3 px-4">
                                        {new Date(transaction.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">{transaction.type}</td>
                                    <td className={`py-3 px-4 text-right ${
                                        transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                                    }`}>
                                        ${Math.abs(transaction.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Virtual Cards Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Virtual Cards</h2>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Request new card
                        </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {virtualCards.map((card, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-lg font-bold">{card.type.toUpperCase()}</div>
                                </div>
                                <div className="mb-4 font-mono text-lg">{card.number}</div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs text-gray-400">CARD HOLDER</div>
                                        <div>{card.holder}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">EXPIRES</div>
                                        <div>{card.expires}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientDashboard;