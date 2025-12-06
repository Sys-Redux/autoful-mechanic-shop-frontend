import { Wrench } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen flex'>
            {/* Left Panel -- Branding */}
            <div className='hidden lg:flex lg:w-1/2 bg-steel-900 flex-col justify-between p-12'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center'>
                        <Wrench className='w-7 h-7 text-white' />
                    </div>
                    <span className='text-2xl font-bold text-white'>
                        Autoful
                    </span>
                </div>

                <div className='space-y-6'>
                    <h1 className='text-4xl font-bold text-white leading-tight'>
                        Mechanic Shop Management<br />
                        <span className='text-brand-400'>
                            Simplified
                        </span>
                    </h1>
                    <p className='text-steel-300 text-lg max-w-md'>
                        Streamline your auto shop operations with Autoful - the all-in-one solution for managing customers,
                        vehicles, inventory, and service tickets with ease.
                    </p>
                </div>

                <p className='text-steel-500 text-sm'>
                    &copy; {new Date().getFullYear()} Autoful. All rights reserved.
                </p>
            </div>

            {/* Right Panel -- Auth Forms */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-steel-50'>
                <div className='w-full max-w-md'>
                    {children}
                </div>
            </div>
        </div>
    );
}