import React from 'react';
import { Button } from '@nextui-org/button';
import { logout } from '../config/auth';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const { setUser } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        setUser(null);
        router.push('/');
    };

    return (
        <p onClick={handleLogout} className="text-pink-600 cursor-pointer">
            Logout
        </p>
    );
};

export default LogoutButton;
