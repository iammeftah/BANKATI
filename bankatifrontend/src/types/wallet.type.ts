// src/types/wallet.types.ts

export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

export interface WalletCreationRequest {
    userId: number;  // Changed from string to number
    initialBalance: string;
}

export interface AccountType {
    id: string;
    name: string;
    initialBalance: string;
}

export const ACCOUNT_TYPES: AccountType[] = [
    { id: 'HSSAB1', name: 'Hssab 1 - Plafond: 200 DH', initialBalance: '200' },
    { id: 'HSSAB2', name: 'Hssab 2 - Plafond: 5000 DH', initialBalance: '5000' },
    { id: 'HSSAB3', name: 'Hssab 3 - Plafond: 10000 DH', initialBalance: '10000' }
];