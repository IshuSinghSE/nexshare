'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { verifyUserSession } from '../config/auth';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        verifyUserSession((user) => {
            setUser(user);
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
