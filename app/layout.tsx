import React from 'react';
import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';

import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: '/favicon.ico',
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body
                className={clsx(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable
                )}
            >
                <Providers
                    themeProps={{ attribute: 'class', defaultTheme: 'dark' }}
                >
                    <div className="relative flex flex-col h-screen">
                        <Navbar />
                        <main className="container mx-auto max-w-7xl pt-8 px-6 flex-grow antialiased">
                            {children}
                        </main>
                        <footer className="w-full flex items-center justify-center py-3">
                            <div className="flex items-center gap-1 text-current antialiased">
                                <span className="text-default-600">
                                    Created with
                                </span>
                                <Link
                                    isExternal
                                    href="https://nextui.org"
                                    title="NextUI"
                                >
                                    <p className="text-primary font-semibold">
                                        NextUI
                                    </p>
                                </Link>
                                <p>&</p>
                                <Link
                                    isExternal
                                    href="https://firebase.google.com"
                                    title="Firebase"
                                >
                                    <p className="text-gradient  font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                                        FireBase
                                    </p>
                                </Link>
                                {/* <span className="text-default-600">by</span>
                                <Link
                                    isExternal
                                    href="https://github.com/IshuSinghSE"
                                    title="IshuSInghSE"
                                >
                                    <p className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                                        Ishu
                                    </p>
                                </Link> */}
                            </div>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
