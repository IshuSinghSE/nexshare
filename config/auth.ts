import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { app } from './firebaseConfig';

export const auth = getAuth(app);

const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const token = await userCredential.user.getIdToken();
        saveAuthToken(token);
        // Signed in
        const user = userCredential.user;
        console.log('User signed in:', user);
        return user;
    } catch (error) {
        throw error;
    }
};

const signUp = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        // Signed up
        const user = userCredential.user;
        console.log('User signed up:', user);
        return user;
    } catch (error) {
        throw error;
    }
};

const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('authToken');
        console.log('User logged out');
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

export { signUp, signIn, logout };

export const saveAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const verifyUserSession = (callback: (user: any) => void) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user);
        } else {
            callback(null);
        }
    });
};
