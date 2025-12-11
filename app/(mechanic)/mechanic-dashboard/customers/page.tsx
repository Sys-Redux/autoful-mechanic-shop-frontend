'use client';
import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import CustomerRow from '@/components/customers/CustomerRow';

export default function CustomersPage() {
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const { data: customers, isLoading } = useCustomers();

    const filteredCustomers = customers?.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
    ) ?? [];


    return (
        <div className='space-y-6'>
            {/* Header */}
            <div>
                <h1 className='text-2xl font-bold text-steel-900'>Customers</h1>
                <p className='text-steel-600'>View all registered customers</p>
            </div>
            {/* Search */}
            <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400' />
                <input
                    type='text'
                    placeholder='Search by name, email, or phone...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input pl-10'
                />
            </div>
            {/* Customer List */}
            <div className='bg-white rounded-xl border border-steel-200 overflow-hidden'>
                {isLoading ? (
                    <div className='p-6 space-y-4'>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className='flex gap-4 animate-pulse'>
                                <div className='w-12 h-12 bg-steel-200 rounded-full' />
                                <div className='flex-1 space-y-2'>
                                    <div className='h-4 bg-steel-200 rounded w-1/3' />
                                    <div className='h-4 bg-steel-100 rounded w-1/2' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredCustomers.length > 0 ? (
                    <div className='divide-y divide-steel-100'>
                        {filteredCustomers.map((customer) => (
                            <CustomerRow
                                key={customer.id}
                                customer={customer}
                                isExpanded={expandedId === customer.id}
                                onToggle={() =>
                                    setExpandedId(expandedId === customer.id ? null : customer.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='p-12 text-center'>
                        <Users className='w-12 h-12 text-steel-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-steel-900 mb-1'>No customers found</h3>
                        <p className='text-steel-500'>
                            {search ? 'Try adjusting your search term' : 'Customers will appear here once they register.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
