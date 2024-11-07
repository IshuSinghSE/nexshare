import {
    getAuth,
    signInWithPopup,
    GithubAuthProvider,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    EmailAuthProvider,
    signInWithEmailAndPassword,
    AuthError,
} from 'firebase/auth';
import { app } from './firebaseConfig';

const provider = new GithubAuthProvider();
const auth = getAuth(app);

const signInWithGithub = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        // console.log(user, token, credential);
        return { user, credential };
    } catch (error) {
        const firebaseError = error as AuthError;
        if (
            firebaseError.code ===
            'auth/account-exists-with-different-credential'
        ) {
            const email = firebaseError.customData?.email as string;
            const pendingCred =
                GithubAuthProvider.credentialFromError(firebaseError);
            const methods = await fetchSignInMethodsForEmail(auth, email);
            window.location.href = `/auth-error?email=${email}&methods=${methods.join(',')}&provider=github&pendingCred=${JSON.stringify(pendingCred)}`;
        } else {
            throw firebaseError;
        }
    }
};

export { signInWithGithub };
