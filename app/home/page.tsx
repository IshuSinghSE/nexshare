import React from 'react';
import { Button } from '@nextui-org/button';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to NexShare</h1>
            <p className="text-lg text-gray-700 mb-8">
                Your one-stop solution for sharing files easily and securely.
            </p>
            <div className="flex gap-4">
                <Button color="primary">Get Started</Button>
                <Button color="secondary">Learn More</Button>
            </div>
        </div>
    );
}
