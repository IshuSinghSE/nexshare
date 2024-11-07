export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: 'Next.js + NextUI',
    description:
        'Make beautiful websites regardless of your design experience.',
    navItems: [
        {
            label: 'Dashboard',
            href: '/dashboard',
            protected: true,
        },
        {
            label: 'Upload',
            href: '/upload',
            protected: true,
        },
        {
            label: 'Preview',
            href: '/preview',
            protected: true,
        },
        {
            label: 'Contact',
            href: '/contact',
            protected: false,
        },
        {
            label: 'About',
            href: '/about',
            protected: false,
        },
    ],
    navMenuItems: [
        {
            label: 'Dashboard',
            href: '/dashboard',
            protected: true,
        },
        {
            label: 'Upload File',
            href: '/upload',
            protected: true,
        },
        {
            label: 'Settings',
            href: '/settings',
            protected: true,
        },
        {
            label: 'Help',
            href: '/help',
            protected: false,
        },
        {
            label: 'Logout',
            href: '/logout',
            protected: true,
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
