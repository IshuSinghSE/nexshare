import React from 'react';
import { Button } from '@nextui-org/button';
import { logout } from '../config/auth';
import { useUser } from '../context/UserContext';

const LogoutButton = () => {
    const { setUser } = useUser();

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return <p onClick={handleLogout}>Logout</p>;
};

export default LogoutButton;
