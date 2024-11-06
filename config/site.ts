export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: 'Next.js + NextUI',
    description:
        'Make beautiful websites regardless of your design experience.',
    navItems: [
        {
            label: 'Upload',
            href: '/upload',
        },
        {
            label: 'Files',
            href: '/files',
        },
        {
            label: 'Contact',
            href: '/contact',
        },
        {
            label: 'About',
            href: '/about',
        },
    ],
    navMenuItems: [
        {
            label: 'My Files',
            href: '/files',
        },
        {
            label: 'Profile',
            href: '/profile',
        },
        {
            label: 'Settings',
            href: '/settings',
        },
        {
            label: 'Help',
            href: '/help',
        },
        {
            label: 'Logout',
            href: '/logout',
        },
    ],
    links: {
        github: 'https://github.com/nextui-org/nextui',
        twitter: 'https://twitter.com/getnextui',
        docs: 'https://nextui.org',
        discord: 'https://discord.gg/9b6yyZKmH4',
        sponsor: 'https://patreon.com/jrgarciadev',
    },
};
