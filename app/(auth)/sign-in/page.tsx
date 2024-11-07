'use client';
import { GoogleIcon, GithubIcon, LockIcon, MailIcon } from '@/components/icons';
import { title } from '@/components/primitives';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithGoogle } from '@/config/googleAuth';
import { signInWithGithub } from '@/config/githubAuth';
import { signIn } from '@/config/auth';
import RedirectIfAuthenticated from '@/components/RedirectIfAuthenticated';

const SignInPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isInvalidEmail, setIsInvalidEmail] = React.useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
        const emailValid = validateEmail(email);
        const passwordValid = validatePassword(password);

        setIsInvalidEmail(!emailValid);
        setIsInvalidPassword(!passwordValid);

        if (!emailValid || !passwordValid) {
            toast.error('Please fill all fields correctly');
            return;
        }

        setIsLoading(true);
        try {
            const user = await signIn(email, password);
            console.log(user);
            toast.success('Signed in successfully');
        } catch (error) {
            let message = 'Firebase: Error (auth/email-already-in-use).';
            if ((error as Error).message === message) {
                toast.error('Email already exists, Sign In');
            } else {
                toast.error(`${(error as Error).message}`);
                console.log((error as Error).message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        console.log('Google sign-in button clicked');
        setIsLoading(true);
        try {
            await signInWithGoogle();
            toast.success('Signed in with Google successfully');
        } catch (error) {
            toast.error('Error signing in with Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubSignIn = async () => {
        console.log('GitHub sign-in button clicked');
        setIsLoading(true);
        try {
            const result = await signInWithGithub();
            console.log('user signed in with github', result);
            if (result) {
                const { user, credential } = result;
                console.log(user, credential);
                toast.success('Signed in with GitHub successfully');
            } else {
                toast.error(
                    'Error signing in with GitHub, Something went wrong'
                );
            }
        } catch (error) {
            if (
                (error as Error).message.includes(
                    'auth/account-exists-with-different-credential'
                )
            ) {
                const methods = (error as Error).message.split(': ')[1];
                toast.error(
                    `An account already exists with a different credential. Please sign in using one of the following methods: ${methods}`
                );
            } else {
                toast.error('Error signing in with GitHub');
                console.log(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validatePassword = (value: string) => {
        return value.length >= 8;
    };

    const InvalidPassword = React.useMemo(() => {
        if (password === '') return false;

        return setIsInvalidPassword(validatePassword(password) ? false : true);
    }, [password]);

    const validateEmail = (value: string) =>
        value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const InvalidEmail = React.useMemo(() => {
        if (email === '') return false;

        return setIsInvalidEmail(validateEmail(email) ? false : true);
    }, [email]);

    const isFormValid =
        email !== '' &&
        password !== '' &&
        !isInvalidEmail &&
        !isInvalidPassword;

    return (
        <section className="flex justify-center items-center px-4 sm:px-6 lg:px-8">
            <ToastContainer autoClose={5000} position="top-center" />
            <Card className="p-4 mx-auto w-full sm:w-4/5 md:w-1/2 mt-12 max-w-96 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h3
                        className={`${title({ size: 'sm', color: 'blue' })} font-bold text-xl`}
                    >
                        Sign In
                    </h3>
                </CardHeader>
                <CardBody className="overflow-visible py-2 flex flex-col gap-3 justify-center">
                    <div className="flex flex-col gap-2">
                        <Input
                            isRequired
                            autoFocus
                            endContent={
                                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            label="Email"
                            placeholder="Enter your email"
                            variant="bordered"
                            value={email}
                            isInvalid={isInvalidEmail}
                            color={isInvalidEmail ? 'danger' : 'default'}
                            errorMessage="Please enter a valid email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            endContent={
                                <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            isRequired
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            variant="bordered"
                            value={password}
                            isInvalid={isInvalidPassword}
                            color={isInvalidPassword ? 'danger' : 'default'}
                            errorMessage="Please enter a valid password, at least 8 characters"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex py-2 px-1 justify-between">
                        <Checkbox
                            classNames={{
                                label: 'text-small',
                            }}
                        >
                            Remember me
                        </Checkbox>
                        <Link color="primary" href="#" size="sm">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center gap-2">
                        <Button
                            isLoading={isLoading}
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            isDisabled={!isFormValid || isLoading}
                        >
                            {isLoading ? 'Signing into Account...' : 'Sign In'}
                        </Button>

                        <div className="flex items-center w-3/4">
                            <hr className="flex-grow border-t dark:border-gray-700" />
                            <span className="mx-2 text-gray-500">Or</span>
                            <hr className="flex-grow border-t dark:border-gray-700" />
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                isDisabled={isLoading}
                                isLoading={isLoading}
                                color="default"
                                variant="flat"
                                fullWidth
                                startContent={<GoogleIcon />}
                                className="bg-gray-50 dark:bg-gray-300 text-black border-1"
                                onClick={handleGoogleSignIn}
                            >
                                Sign in with Google
                            </Button>
                            <Button
                                isDisabled={isLoading}
                                isLoading={isLoading}
                                color="default"
                                variant="flat"
                                fullWidth
                                startContent={<GithubIcon />}
                                className="bg-zinc-900 text-background dark:text-foreground"
                                onClick={handleGithubSignIn}
                            >
                                Sign in with GitHub
                            </Button>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">
                                Don&apos;t have an account?&nbsp;
                            </span>
                            <Link color="primary" href="/sign-up" size="sm">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </section>
    );
};

export default function SignIn() {
    return (
        <RedirectIfAuthenticated>
            <SignInPage />
        </RedirectIfAuthenticated>
    );
}
