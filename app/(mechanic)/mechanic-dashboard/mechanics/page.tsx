'use client';
import { useState } from 'react';
import { Search, Wrench, Trophy } from 'lucide-react';
import { useMechanics, useTopMechanics } from '@/hooks/useMechanics';
import MechanicRow from '@/components/mechanics/MechanicRow';

export default function MechanicsPage() {
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const { data: mechanics, isLoading } = useMechanics();
    const { data: topMechanics } = useTopMechanics();

    const filteredMechanics = mechanics?.filter(mechanic =>
        mechanic.name.toLowerCase().includes(search.toLowerCase()) ||
        mechanic.email.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const topMechanicIds = topMechanics?.map(m => m.id) ?? [];


    return (
        <div className='space-y-6'>
            {/* Header */}
            <div>
                <h1 className='text-2xl font-bold text-steel-900'>Mechanics</h1>
                <p className='text-steel-600'>View all mechanics</p>
            </div>
            {/* Top Performers */}
            {topMechanics && topMechanics.length > 0 && (
                <div className='bg-linear-to-r from-brand-600 to-brand-700 rounded-xl p-6 text-white'>
                    <div className='flex items-center gap-2 mb-4'>
                        <Trophy className='w-5 h-5 text-amber-300' />
                        <h2 className='font-semibold'>Top Performers</h2>
                    </div>
                    <div className='grid sm:grid-cols-3 gap-4'>
                        {topMechanics.map((mechanic, index) => (
                            <div
                                key={mechanic.id}
                                className='bg-white/10 backdrop-blur-sm rounded-lg p-4'
                            >
                                <div className='flex items-center gap-3'>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        index === 0 ? 'bg-amber-400 text-amber-900' :
                                        index === 1 ? 'bg-amber-300 text-gray-700' :
                                        'bg-orange-400 text-orange-900'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className='font-medium'>{mechanic.name}</p>
                                        <p className='text-sm text-white/70'>{mechanic.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Search */}
            <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-400' />
                <input
                    type='text'
                    placeholder='Search by name or email...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input pl-10'
                />
            </div>
            {/* Mechanic List */}
            <div className='bg-white rounded-xl border border-steel-200 overflow-hidden'>
                {isLoading ? (
                    <div className='p-6 space-y-4'>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className='flex gap-4 animate-pulse'>
                                <div className='w-12 h-12 bg-steel-200 rounded-full' />
                                <div className='flex-1 space-y-2'>
                                    <div className='h-4 bg-steel-200 rounded w-1/3' />
                                    <div className='h-4 bg-steel-100 rounded w-1/2' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredMechanics.length > 0 ? (
                    <div className='divide-y divide-steel-100'>
                        {filteredMechanics.map((mechanic) => (
                            <MechanicRow
                                key={mechanic.id}
                                mechanic={mechanic}
                                isExpanded={expandedId === mechanic.id}
                                onToggle={() => setExpandedId(expandedId === mechanic.id ? null : mechanic.id)}
                                isTopPerformer={topMechanicIds.includes(mechanic.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='p-12 text-center'>
                        <Wrench className='w-12 h-12 text-steel-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-steel-900 mb-1'>No mechanics found</h3>
                        <p className='text-steel-600'>
                            {search ? 'Try a different search term' : 'Mechanics will appear here once they are added.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}