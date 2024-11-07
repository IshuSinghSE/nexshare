import { subtitle, title } from '@/components/primitives';
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

const SettingsPage = () => {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-lg text-center justify-center">
                <h1 className={title({ color: 'blue' })}>Settings</h1>
                <p className={`${subtitle()}`}>Comming soon...</p>
            </div>
        </section>
    );
};

export default function Settings() {
    return (
        <ProtectedRoute>
            <SettingsPage />
        </ProtectedRoute>
    );
}
