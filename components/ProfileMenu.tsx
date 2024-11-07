'use client';
import React from 'react';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@nextui-org/dropdown';
import { Avatar, AvatarIcon } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { PlusIcon } from './icons';
import LogoutButton from './LogoutButton';

const ProfileMenu = () => {
    const { user } = useUser();
    const avatarSrc = user?.photoURL || '/path/to/default/avatar.png'; // Add a fallback image
    console.log(user);
    return (
        <>
            {user ? (
                <Dropdown
                    placement="bottom-end"
                    classNames={{
                        base: 'before:bg-default-200', // change arrow background
                        content:
                            'py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
                    }}
                >
                    <DropdownTrigger>
                        {user.photoURL ? (
                            <Avatar
                                isBordered
                                color="primary"
                                as="button"
                                className="transition-transform"
                                src={avatarSrc} // Use the fallback image
                            />
                        ) : (
                            <Avatar
                                icon={<AvatarIcon />}
                                classNames={{
                                    base: 'bg-gradient-to-br from-[#FFB457] to-[#FF705B]',
                                    icon: 'text-black/80',
                                }}
                            />
                        )}
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as </p>
                            <p className="font-semibold">{user?.email}</p>
                        </DropdownItem>
                        <DropdownItem key="dashboard">
                            <Link href="/dashboard">Dashboard</Link>
                        </DropdownItem>
                        <DropdownItem
                            key="new_file"
                            endContent={<PlusIcon className="text-large" />}
                        >
                            <Link href="/upload">Upload File</Link>
                        </DropdownItem>

                        <DropdownItem key="settings">
                            <Link href="/settings">Settings</Link>
                        </DropdownItem>
                        <DropdownItem key="help_and_feedback">
                            <Link href="/help">Help & Feedback</Link>
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            <LogoutButton />
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            ) : (
                <Button
                    href="/sign-in"
                    as={Link}
                    color="primary"
                    variant="solid"
                    radius="full"
                    size="md"
                >
                    Sign In
                </Button>
            )}
            {/* Other components for authenticated users */}
        </>
    );
};

export default ProfileMenu;
