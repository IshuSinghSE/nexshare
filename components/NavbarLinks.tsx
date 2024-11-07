'use client';
import { siteConfig } from '@/config/site';
import { Link } from '@nextui-org/link';
import { NavbarItem, NavbarMenuItem } from '@nextui-org/navbar';
import React from 'react';
import clsx from 'clsx';
import NextLink from 'next/link';
import { link as linkStyles } from '@nextui-org/theme';
import { useUser } from '@/context/UserContext';
import { Logo } from './icons';
import { title } from './primitives';

const NavbarLinks = () => {
    const { user } = useUser();
    return (
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems
                .filter((item) => !item.protected || user)
                .map((item) => (
                    <NavbarItem key={item.href}>
                        <NextLink
                            className={clsx(
                                linkStyles({ color: 'foreground' }),
                                'data-[active=true]:text-primary data-[active=true]:font-medium'
                            )}
                            color="foreground"
                            href={item.href}
                        >
                            {item.label}
                        </NextLink>
                    </NavbarItem>
                ))}
        </ul>
    );
};

const NavbarMenuLinks = () => {
    const { user } = useUser();
    return (
        <div className="mx-4 mt-2 flex flex-col gap-2">
            {siteConfig.navMenuItems
                .filter((item) => !item.protected || user)
                .map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            color={
                                index === 2
                                    ? 'primary'
                                    : index ===
                                        siteConfig.navMenuItems.length - 1
                                      ? 'danger'
                                      : 'foreground'
                            }
                            href={item.href}
                            size="lg"
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
        </div>
    );
};

const NavbarLogo = () => {
    const { user } = useUser();
    return (
        <>
            <NextLink
                className="flex justify-start items-center gap-1"
                href={user ? '/dashboard' : '/'}
            >
                <Logo />
                <p
                    className={`${title({ color: 'blue', size: 'xs' })} font-bold text-7xl bg-gradient-to-b from-blue-500 to-sky-500 bg-clip-text text-transparent`}
                >
                    NEXSHARE
                </p>
            </NextLink>
        </>
    );
};

export { NavbarLinks, NavbarMenuLinks, NavbarLogo };
