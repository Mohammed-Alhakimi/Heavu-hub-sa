import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/currency';

interface Listing {
    id: string;
    title: string;
    category: string;
    make: string;
    model: string;
    year: number;
    price: {
        buy: number | null;
        rentDaily: number | null;
        rentWeekly: number | null;
        rentMonthly: number | null;
    };
    images: string[];
    status: 'active' | 'sold' | 'hidden';
    createdAt: any;
}

interface MyFleetScreenProps {
    onBack: () => void;
    onCreateListing: () => void;
}

const MyFleetScreen: React.FC<MyFleetScreenProps> = ({ onBack, onCreateListing }) => {
    const { t, i18n } = useTranslation();
    const { currentUser } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchListings();
    }, [currentUser]);

    const fetchListings = async () => {
        if (!currentUser) return;

        try {
            setLoading(true);
            const q = query(
                collection(db, 'listings'),
                where('sellerId', '==', currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const fetchedListings: Listing[] = [];
            querySnapshot.forEach((doc) => {
                fetchedListings.push({ id: doc.id, ...doc.data() } as Listing);
            });
            // Sort by createdAt descending
            fetchedListings.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime.getTime() - aTime.getTime();
            });
            setListings(fetchedListings);
        } catch (err: any) {
            console.error('Error fetching listings:', err);
            setError('Failed to load listings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (listingId: string, newStatus: 'active' | 'sold' | 'hidden') => {
        try {
            await updateDoc(doc(db, 'listings', listingId), { status: newStatus });
            setListings(prev =>
                prev.map(l => l.id === listingId ? { ...l, status: newStatus } : l)
            );
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update status');
        }
    };

    const handleDelete = async (listingId: string) => {
        try {
            await deleteDoc(doc(db, 'listings', listingId));
            setListings(prev => prev.filter(l => l.id !== listingId));
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Error deleting listing:', err);
            setError('Failed to delete listing');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'sold': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'hidden': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Fleet</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Manage your equipment listings
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCreateListing}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">add</span>
                        Add Listing
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : listings.length === 0 ? (
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">inventory_2</span>
                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No listings yet</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Start by adding your first equipment listing
                        </p>
                        <button
                            onClick={onCreateListing}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Create Your First Listing
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {listings.map((listing) => (
                            <div
                                key={listing.id}
                                className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
                            >
                                {/* Image */}
                                <div className="w-full md:w-48 h-40 md:h-auto bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                    {listing.images && listing.images.length > 0 ? (
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                                {listing.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {listing.year} {listing.make} {listing.model} • {listing.category}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(listing.status)}`}>
                                            {listing.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                        {listing.price.buy && (
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400">Buy: </span>
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {formatCurrency(listing.price.buy, i18n.language)}
                                                </span>
                                            </div>
                                        )}
                                        {listing.price.rentDaily && (
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400">Daily: </span>
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {formatCurrency(listing.price.rentDaily, i18n.language)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <select
                                            value={listing.status}
                                            onChange={(e) => handleStatusChange(listing.id, e.target.value as 'active' | 'sold' | 'hidden')}
                                            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="active">Active</option>
                                            <option value="hidden">Hidden</option>
                                            <option value="sold">Sold</option>
                                        </select>

                                        {deleteConfirm === listing.id ? (
                                            <div className="flex items-center gap-2 ml-auto">
                                                <span className="text-sm text-red-600 dark:text-red-400">Delete?</span>
                                                <button
                                                    onClick={() => handleDelete(listing.id)}
                                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(listing.id)}
                                                className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyFleetScreen;
