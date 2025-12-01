import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';
import type {
    AuthUser,
    LoginData,
    RegisterCustomerData,
    RegisterMechanicData,
    LoginResponse,
    CreateUserResponse,
} from '@/types/auth';
import type { UserRole } from '@/types/index';

// Wraps Firebase Auth SDK
// Handles:
//   - Firebase Auth Operations
//   - Mapping Firebase Users to AuthUser
//   - Token Management for API Calls

// Helper: Map Firebase User + Backend Data to AuthUser
export const mapToAuthUser = (
    firebaseUser: FirebaseUser,
    role: UserRole,
    db_id: number,
    displayName?: string | null
): AuthUser => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: displayName || firebaseUser.displayName,
    role,
    db_id,
})

export const registerCustomer = async (data: RegisterCustomerData): Promise<AuthUser> => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
    );

    const backendResponse = await api.post<CreateUserResponse>('/customers', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        firebase_uid: userCredential.user.uid,
    });

    return mapToAuthUser(
        userCredential.user,
        'customer',
        backendResponse.id,
        data.name
    );
};

export const registerMechanic = async (data: RegisterMechanicData): Promise<AuthUser> => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
    );

    const backendResponse = await api.post<CreateUserResponse>('/mechanics', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        salary: data.salary,
        password: data.password,
        firebase_uid: userCredential.user.uid,
    });

    return mapToAuthUser(
        userCredential.user,
        'mechanic',
        backendResponse.id,
        data.name
    );
};

export const loginCustomer = async (data: LoginData): Promise<AuthUser> => {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
    );

    const response = await api.post<LoginResponse & { customer_id: number; name: string; }>(
        '/customers/login',
        { email: data.email, password: data.password }
    );

    return mapToAuthUser(
        userCredential.user,
        'customer',
        response.customer_id,
        response.name
    );
};

export const loginMechanic = async (data: LoginData): Promise<AuthUser> => {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
    );

    const response = await api.post<LoginResponse & { name: string }>(
        '/mechanics/login',
        { email: data.email, password: data.password }
    );

    return mapToAuthUser(
        userCredential.user,
        'mechanic',
        response.mechanic_id!,
        response.name
    );
};

export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
};

export const getCurrentToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
};

export const refreshUserData = async (
    firebaseUser: FirebaseUser,
    role: UserRole,
    db_id: number
): Promise<AuthUser> => {
    const endpoint = role === 'customer' ? `/customers/${db_id}` : `/mechanics/${db_id}`;
    const userData = await api.get<{ name: string }>(endpoint, true);

    return mapToAuthUser(
        firebaseUser,
        role,
        db_id,
        userData.name
    );
};