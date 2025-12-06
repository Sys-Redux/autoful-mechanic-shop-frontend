'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wrench, Menu, X, LogOut } from "lucide-react";
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { selectUser, selectIsMechanic, logout } from '@/lib/store/authSlice';
import { toast } from 'sonner';

interface NavbarProps {
    transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const isMechanic = useAppSelector(selectIsMechanic);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(!transparent);

    useEffect(() => {
        if (!transparent) return;

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [transparent]);

    const dashboardLink = isMechanic ? '/mechanic-dashboard' : '/customer-dashboard';

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            toast.success('Logged out successfully');
            router.push('/');
        } catch {
            toast.error('Failed to log out');
        }
    };

    const isOnDashboard = pathname?.startsWith('/customer-dashboard') || pathname?.startsWith('/mechanic-dashboard');


    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || transparent
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-steel-200'
                    : 'bg-transparent'
            }`}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16 md:h-20'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center gap-3 group'>
                        <div
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center
                                transition-colors ${
                                    scrolled || !transparent
                                        ? 'bg-brand-500'
                                        : 'bg-white/20 backdrop-blur-sm'
                                }`}
                        >
                            <Wrench
                                className={`w-5 h-5 md:w-6 md:h-6 ${
                                    scrolled || !transparent ? 'text-white' : 'text-white'
                                }`}
                            />
                        </div>
                        <span
                            className={`text-xl md:text-2xl font-bold transition-colors ${
                                scrolled || !transparent ? 'text-steel-900' : 'text-white'
                            }`}
                        >
                            Autoful
                        </span>
                    </Link>
                    {/* Desktop Navigation */}
                    <nav className='hidden md:flex items-center gap-2'>
                        {user ? (
                            // Logged in
                            <div className='flex items-center gap-4'>
                                {!isOnDashboard && (
                                    <Link href={dashboardLink} className='btn-primary'>
                                        Dashboard
                                    </Link>
                                )}
                                {isOnDashboard && (
                                    <>
                                        <div className='text-right mr-2'>
                                            <p className='text-sm font-medium text-steel-900'>
                                                {user.displayName || 'User'}
                                            </p>
                                            <p className='text-xs text-steel-500'>
                                                {user.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className='p-2 text-steel-400 hover:text-red-500 hover:bg-red-50 rounded-lg
                                                transition-colors'
                                            title='Log Out'
                                        >
                                            <LogOut className='w-5 h-5' />
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            // Not logged in
                            <>
                                <Link
                                    href='/login'
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        scrolled || !transparent
                                            ? 'text-steel-600 hover:text-steel-900 hover:bg-steel-100'
                                            : 'text-white/90 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    Log In
                                </Link>
                                <Link href='/register' className='btn-accent'>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            scrolled || !transparent
                                ? 'text-steel-600 hover:bg-steel-100'
                                : 'text-white hover:bg-white/10'
                        }`}
                        aria-label='Toggle Menu'
                    >
                        {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                    </button>
                </div>
            </div>
            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className='md:hidden bg-white border-t border-steel-200 shadow-lg'>
                    <div className='px-4 py-4 space-y-3'>
                        {user ? (
                            <>
                                <div className='px-4 py-2 border-b border-steel-100 mb-2'>
                                    <p className='font-medium text-steel-900'>
                                        {user.displayName || 'User'}
                                    </p>
                                    <p className='text-sm text-steel-500'>
                                        {user.email}
                                    </p>
                                </div>
                                {!isOnDashboard && (
                                    <Link
                                        href={dashboardLink}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className='block w-full btn-primary text-center'
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className='flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50
                                        rounded-lg text-sm font-medium'
                                >
                                    <LogOut className='w-5 h-5' />
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href='/login'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className='block w-full py-3 text-center text-steel-600 font-medium
                                        hover:bg-steel-50 rounded-lg'
                                >
                                    Log In
                                </Link>
                                <Link
                                    href='/register'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className='block w-full btn-accent text-center'
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}