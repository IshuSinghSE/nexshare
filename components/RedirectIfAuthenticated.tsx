import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RedirectIfAuthenticated = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    if (user) {
        return null; // or a loading spinner
    }

    return <>{children}</>;
};

export default RedirectIfAuthenticated;
