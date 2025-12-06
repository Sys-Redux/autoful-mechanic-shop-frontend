'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Ticket, User } from "lucide-react";

const customerLinks = [
    { href: '/customer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/customer-dashboard/my-tickets', label: 'My Tickets', icon: Ticket },
    { href: '/customer-dashboard/profile', label: 'Profile', icon: User },
];

export default function CustomerSubNav() {
    const pathname = usePathname();


    return (
        <nav className='bg-white border-b border-steel-200'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center gap-1 h-14 overflow-x-auto'>
                    {customerLinks.map((link) => {
                        const isActive = link.href === '/customer-dashboard'
                            ? pathname === '/customer-dashboard'
                            : pathname?.startsWith(link.href);
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                                    whitespace-nowrap transition-colors ${
                                        isActive
                                            ? 'bg-brand-50 text-brand-600'
                                            : 'text-steel-600 hover:bg-steel-100 hover:text-steel-900'
                                    }`}
                            >
                                <Icon className='w-4 h-4' />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}