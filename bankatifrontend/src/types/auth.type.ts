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
    identityType: 'CIN' | 'PASSPORT' | 'RESIDENT_PERMIT';
    identityNumber: string;
    birthDate: string;
    address: string;
    registrationNumber: string;
    patentNumber: string;
}


export interface Client extends User {
    ceilingType: 'HSSAB1' | 'HSSAB2' | 'HSSAB3';  // Changed from accountType
    balance: number;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    createdAt: string;
    updatedAt: string;
}