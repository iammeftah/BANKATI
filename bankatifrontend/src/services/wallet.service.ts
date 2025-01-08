import { WalletCreationRequest } from '../types/wallet.type';
import { walletApi as api } from './api';

interface WalletDTO {
    id: string;
    userId: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

interface TransactionDTO {
    id: number;
    walletId: string;
    amount: number;
    type: string;
    timestamp: string;
}

export const walletService = {
    getWallet: async (): Promise<WalletDTO> => {
        const response = await api.get('/wallets/current');
        return response.data;
    },

    createWallet: async (walletRequest: WalletCreationRequest): Promise<string> => {
        console.log('Creating wallet with request:', walletRequest);
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await api.post('/wallets', walletRequest);
        return response.data;
    },


    rechargeWallet: async (amount: number): Promise<string> => {
        const response = await api.post('/wallets/recharge', {
            amount
        });
        return response.data;
    },

    debitWallet: async (amount: number): Promise<string> => {
        const response = await api.post('/wallets/debit', {
            amount
        });
        return response.data;
    },

    transferFunds: async (toWalletId: string, amount: number): Promise<string> => {
        const response = await api.post('/wallets/transfer', {
            toWalletId,
            amount
        });
        return response.data;
    },

    getTransactions: async (): Promise<TransactionDTO[]> => {
        const response = await api.get('/transactions/current');
        return response.data;
    }
};