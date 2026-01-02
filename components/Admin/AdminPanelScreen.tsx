import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { updateListingStatus, deleteListing } from '../../services/listings';

interface Listing {
    id: string;
    title: string;
    category: string;
    make: string;
    model: string;
    year: number;
    sellerId: string;
    price: {
        buy: number | null;
        rentDaily: number | null;
        rentWeekly: number | null;
        rentMonthly: number | null;
    };
    images: string[];
    status: 'pending' | 'active' | 'rejected' | 'sold' | 'hidden';
    createdAt: any;
}

interface AdminPanelScreenProps {
    onBack: () => void;
}

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({ onBack }) => {
    const { t, i18n } = useTranslation();
    const { currentUser, userRole } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (userRole === 'admin') {
            fetchListings();
        }
    }, [userRole, filter]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            let q;
            if (filter === 'pending') {
                q = query(collection(db, 'listings'), where('status', '==', 'pending'));
            } else {
                q = query(collection(db, 'listings'));
            }

            const querySnapshot = await getDocs(q);
            const fetchedListings: Listing[] = [];
            querySnapshot.forEach((docSnapshot) => {
                const data = docSnapshot.data() as Omit<Listing, 'id'>;
                fetchedListings.push({ id: docSnapshot.id, ...data });
            });

            // Sort by createdAt descending (newest first)
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

    const handleApprove = async (listingId: string) => {
        try {
            setActionLoading(listingId);
            await updateListingStatus(listingId, 'active');
            setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: 'active' as const } : l));
        } catch (err) {
            console.error('Error approving listing:', err);
            setError('Failed to approve listing');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (listingId: string) => {
        try {
            setActionLoading(listingId);
            await updateListingStatus(listingId, 'rejected');
            setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: 'rejected' as const } : l));
        } catch (err) {
            console.error('Error rejecting listing:', err);
            setError('Failed to reject listing');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (listingId: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this listing? This action cannot be undone.')) {
            return;
        }

        try {
            setActionLoading(listingId);
            await deleteListing(listingId);
            setListings(prev => prev.filter(l => l.id !== listingId));
        } catch (err) {
            console.error('Error deleting listing:', err);
            setError('Failed to delete listing');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'sold': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'hidden': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    // Redirect if not admin
    if (userRole !== 'admin') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-red-400 mb-4">block</span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-4">You don't have permission to access this page.</p>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-primary text-slate-900 rounded-lg font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-8 px-4">
            <div className="max-w-6xl mx-auto">
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
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                                Admin Panel
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Review and approve equipment listings
                            </p>
                        </div>
                    </div>

                    {/* Filter Toggle */}
                    <div className="flex bg-white dark:bg-surface-dark rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                                ? 'bg-primary text-slate-900'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-primary text-slate-900'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            All Listings
                        </button>
                    </div>
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
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
                            {filter === 'pending' ? 'check_circle' : 'inventory_2'}
                        </span>
                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            {filter === 'pending' ? 'No pending listings' : 'No listings found'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            {filter === 'pending'
                                ? 'All listings have been reviewed'
                                : 'There are no listings in the system yet'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {listings.map((listing) => (
                            <div
                                key={listing.id}
                                className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
                            >
                                {/* Image */}
                                <div className="w-full md:w-56 h-44 md:h-auto bg-slate-100 dark:bg-slate-800 flex-shrink-0">
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
                                        <span className="text-xs text-slate-400">Seller ID: {listing.sellerId.slice(0, 8)}...</span>

                                        <div className="ml-auto flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(listing.id)}
                                                disabled={actionLoading === listing.id}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete Listing"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>

                                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                                            {listing.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleReject(listing.id)}
                                                        disabled={actionLoading === listing.id}
                                                        className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(listing.id)}
                                                        disabled={actionLoading === listing.id}
                                                        className="px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                                        Approve
                                                    </button>
                                                </>
                                            )}
                                            {listing.status === 'rejected' && (
                                                <button
                                                    onClick={() => handleApprove(listing.id)}
                                                    disabled={actionLoading === listing.id}
                                                    className="px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">undo</span>
                                                    Approve
                                                </button>
                                            )}
                                            {listing.status === 'active' && (
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleReject(listing.id)}
                                                        disabled={actionLoading === listing.id}
                                                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        Hide
                                                    </button>
                                                    <span className="text-sm text-green-600 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                        Live
                                                    </span>
                                                </div>
                                            )}
                                        </div>
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

export default AdminPanelScreen;
