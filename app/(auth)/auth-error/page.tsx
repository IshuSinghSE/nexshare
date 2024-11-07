'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import {
    getAuth,
    EmailAuthProvider,
    linkWithCredential,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from 'react-toastify';

const AuthError = () => {
    const router = useRouter();
    const { email, methods, provider, pendingCred } = router.query;
    const [signInMethods, setSignInMethods] = useState<string[]>([]);
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (methods) {
            setSignInMethods((methods as string).split(','));
        }
    }, [methods]);

    const handleLinkAccount = async () => {
        setIsLoading(true);
        try {
            const auth = getAuth();
            const credential = EmailAuthProvider.credential(
                email as string,
                password
            );
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email as string,
                password
            );
            await linkWithCredential(
                userCredential.user,
                JSON.parse(pendingCred as string)
            );
            toast.success('Accounts linked successfully');
            router.push('/dashboard'); // Redirect to the dashboard or any other page
        } catch (error) {
            toast.error('Error linking accounts');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="p-4 mx-auto w-full sm:w-4/5 md:w-1/2 mt-12 max-w-96">
                <h3 className="font-bold text-xl">Account Exists</h3>
                <p className="mt-2">
                    An account already exists with the email{' '}
                    <strong>{email}</strong> but with a different sign-in
                    method.
                </p>
                <p className="mt-2">
                    Please sign in using one of the following methods:
                </p>
                <ul className="mt-2">
                    {signInMethods.map((method, index) => (
                        <li key={index}>{method}</li>
                    ))}
                </ul>
                {signInMethods.includes(
                    EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
                ) && (
                    <div className="mt-4">
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 w-full"
                        />
                        <Button
                            color="primary"
                            onClick={handleLinkAccount}
                            isLoading={isLoading}
                            disabled={isLoading || !password}
                            className="mt-2"
                        >
                            Link Accounts
                        </Button>
                    </div>
                )}
                <div className="mt-4">
                    <Link href="/sign-in">
                        <Button color="primary">Go to Sign In</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AuthError;