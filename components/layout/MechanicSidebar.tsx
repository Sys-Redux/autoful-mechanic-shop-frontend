'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Ticket,
    Package,
    Users,
    Wrench,
    AlertTriangle,
    PlusCircle,
} from "lucide-react";

const mechanicLinks = [
    { href: '/mechanic-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/mechanic-dashboard/tickets', label: 'Service Tickets', icon: Ticket },
    { href: '/mechanic-dashboard/tickets/new', label: 'Create Ticket', icon: PlusCircle, indent: true },
    { href: '/mechanic-dashboard/inventory', label: 'Inventory', icon: Package },
    { href: '/mechanic-dashboard/inventory/low-stock', label: 'Low Stock', icon: AlertTriangle, indent: true },
    { href: '/mechanic-dashboard/customers', label: 'Customers', icon: Users },
    { href: '/mechanic-dashboard/mechanics', label: 'Mechanics', icon: Wrench },
];

export default function MechanicSidebar() {
    const pathname = usePathname();


    return (
        <>
            {/* Desktop Sidebar */}
            <aside className='hidden lg:flex flex-col w-64 bg-white border-r border-steel-200 min-h-[calc(100vh-5rem)]'>
                <nav className='flex-1 p-4 space-y-1'>
                    {mechanicLinks.map((link) => {
                        const isActive =
                            link.href === '/mechanic-dashboard'
                                ? pathname === '/mechanic-dashboard'
                                : pathname?.startsWith(link.href) &&
                                    (link.href !== '/mechanic-dashboard/tickets' ||
                                        !pathname?.includes('/new'));
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    link.indent ? 'ml-4' : ''
                                } ${
                                    isActive
                                        ? 'bg-brand-50 text-brand-600'
                                        : 'text-steel-600 hover:bg-steel-100 hover:text-steel-900'
                                }`}
                            >
                                <Icon className='w-5 h-5' />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            {/* Mobile Bottom Nav */}
            <nav className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-steel-200 z-40'>
                <div className='flex items-center justify-around h-16'>
                    {mechanicLinks
                        .filter((link) => !link.indent)
                        .slice(0, 5)
                        .map((link) => {
                            const isActive =
                                link.href === '/mechanic-dashboard'
                                    ? pathname === '/mechanic-dashboard'
                                    : pathname?.startsWith(link.href);
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${
                                        isActive ? 'text-brand-600' : 'text-steel-500'
                                    }`}
                                >
                                    <Icon className='w-5 h-5' />
                                    <span className='truncate max-w-[60px]'>{link.label.split(' ')[0]}</span>
                                </Link>
                            );
                        })}
                </div>
            </nav>
        </>
    );
}