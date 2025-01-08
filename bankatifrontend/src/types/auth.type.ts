export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'ADMIN' | 'CLIENT' | 'AGENT';
};

export type AuthResponse = {
    token: string;
    user: User;
};

export type LoginCredentials = {
    phone: string;
    password: string;
};


export interface Agent extends User {
    placeId: string;
    pieceNumber: string;
    birthDate: string;
    address: string;
    immatriculationNumber: string;
}

export interface Client extends User {
    accountType: 'HSSAB1' | 'HSSAB2' | 'HSSAB3';
    balance: number;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    createdAt: string;
    updatedAt: string;
}
