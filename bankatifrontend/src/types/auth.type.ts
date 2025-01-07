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
