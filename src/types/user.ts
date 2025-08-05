import { User as authUser} from '@auth0/auth0-react';

interface User {
    authUser: authUser,
    auth0Id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isEmailVerified: boolean;
    lastLoginAt: Date;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type { User };