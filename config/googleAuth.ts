import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    EmailAuthProvider,
    signInWithEmailAndPassword,
    AuthError,
} from 'firebase/auth';
import { app } from './firebaseConfig';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log(user);
        return user;
    } catch (error) {
        const firebaseError = error as AuthError;
        if (
            firebaseError.code ===
            'auth/account-exists-with-different-credential'
        ) {
            const email = firebaseError.customData?.email as string;
            const pendingCred =
                GoogleAuthProvider.credentialFromError(firebaseError);
            const methods = await fetchSignInMethodsForEmail(auth, email);
            window.location.href = `/auth-error?email=${email}&methods=${methods.join(',')}&provider=google&pendingCred=${JSON.stringify(pendingCred)}`;
        } else {
            throw firebaseError;
        }
    }
};

export { signInWithGoogle };
