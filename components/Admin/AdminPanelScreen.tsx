import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { updateListingStatus, deleteListing, getListingById } from '../../services/listings';
import { BookingService } from '../../services/BookingService';
import { AccountService } from '../../services/AccountService';
import { DeletionRequest, Booking, EquipmentListing } from '../../types';

interface BookingWithSeller extends Booking {
    sellerName?: string;
    sellerPhone?: string;
}

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
    onListingClick?: (listing: EquipmentListing) => void;
}

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({ onBack, onListingClick }) => {
    const { t, i18n } = useTranslation();
    const { currentUser, userRole } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');
    const [activeTab, setActiveTab] = useState<'listings' | 'deletions' | 'bookings'>('listings');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([]);
    const [bookings, setBookings] = useState<BookingWithSeller[]>([]);
    const [bookingFilter, setBookingFilter] = useState<'active' | 'all'>('active');

    useEffect(() => {
        if (userRole === 'admin') {
            if (activeTab === 'listings') {
                fetchListings();
            } else if (activeTab === 'deletions') {
                fetchDeletionRequests();
            } else if (activeTab === 'bookings') {
                fetchBookings();
            }
        }
    }, [userRole, filter, activeTab, bookingFilter]);

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
        try {
            setActionLoading(listingId);

            // Step 1: Fetch listing data to get images
            const listing = await getListingById(listingId);
            if (!listing) {
                setError('Listing not found');
                setActionLoading(null);
                return;
            }

            // Step 2: Check for active bookings
            const activeBookingsCount = await BookingService.getActiveBookingsForListing(listingId);

            // First confirmation: Warn if active bookings exist
            if (activeBookingsCount > 0) {
                const warningMessage = `⚠️ Warning: Active Bookings Detected\n\nThis listing has ${activeBookingsCount} active booking(s). Deleting this listing will NOT cancel these bookings, but the listing will no longer be accessible.\n\nAre you sure you want to continue?`;
                if (!window.confirm(warningMessage)) {
                    setActionLoading(null);
                    return;
                }
            }

            // Second confirmation: Final deletion warning
            const finalConfirmation = '🗑️ Permanent Deletion\n\nThis will permanently delete the listing and all associated photos from storage. This action cannot be undone.\n\nClick OK to confirm deletion.';
            if (!window.confirm(finalConfirmation)) {
                setActionLoading(null);
                return;
            }

            // Step 3: Delete photos from Firebase Storage
            if (listing.images && listing.images.length > 0) {
                const deletePhotoPromises = listing.images.map(async (imageUrl) => {
                    try {
                        // Extract the storage path from the URL
                        // URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
                        const urlParts = imageUrl.split('/o/');
                        if (urlParts.length > 1) {
                            const pathWithParams = urlParts[1].split('?')[0];
                            const storagePath = decodeURIComponent(pathWithParams);
                            const imageRef = ref(storage, storagePath);
                            await deleteObject(imageRef);
                        }
                    } catch (photoErr) {
                        console.error('Error deleting photo:', photoErr);
                        // Continue even if photo deletion fails
                    }
                });
                await Promise.all(deletePhotoPromises);
            }

            // Step 4: Delete the listing from Firestore
            await deleteListing(listingId);

            // Step 5: Update UI
            setListings(prev => prev.filter(l => l.id !== listingId));
        } catch (err) {
            console.error('Error deleting listing:', err);
            setError('Failed to delete listing: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setActionLoading(null);
        }
    };

    const handleListingLinkClick = async (listingId: string) => {
        if (!onListingClick) return;
        try {
            setActionLoading(listingId);
            const docRef = doc(db, 'listings', listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() } as EquipmentListing;
                onListingClick(data);
            } else {
                alert('Listing not found');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(null);
        }
    };

    const fetchDeletionRequests = async () => {
        try {
            setLoading(true);
            const requests = await AccountService.getDeletionRequests();
            // Sort by createdAt descending
            requests.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime.getTime() - aTime.getTime();
            });
            setDeletionRequests(requests);
        } catch (err) {
            console.error('Error fetching deletion requests:', err);
            setError('Failed to load deletion requests');
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            let q;
            if (bookingFilter === 'active') {
                q = query(collection(db, 'bookings'), where('status', 'in', ['pending', 'confirmed']));
            } else {
                q = query(collection(db, 'bookings'));
            }

            const querySnapshot = await getDocs(q);

            const bookingPromises = querySnapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data() as Booking;
                const booking: BookingWithSeller = { id: docSnapshot.id, ...data };

                // Fetch Seller Name
                if (booking.sellerId) {
                    try {
                        const sellerDoc = await getDoc(doc(db, 'users', booking.sellerId));
                        if (sellerDoc.exists()) {
                            const sellerData = sellerDoc.data();
                            booking.sellerName = sellerData.displayName;
                            booking.sellerPhone = sellerData.phoneNumber;
                        } else {
                            booking.sellerName = 'Unknown Seller';
                        }
                    } catch (e) {
                        console.error('Error fetching seller details', e);
                        booking.sellerName = 'Error Loading';
                    }
                }
                return booking;
            });

            const fetchedBookings = await Promise.all(bookingPromises);

            // Sort by createdAt descending
            fetchedBookings.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime.getTime() - aTime.getTime();
            });

            setBookings(fetchedBookings);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveDeletion = async (request: DeletionRequest) => {
        if (!window.confirm(`Are you sure you want to APPROVE account deletion for ${request.userEmail}? This will confirm the request, but the actual data removal must be done via the Firebase Console for now.`)) {
            return;
        }

        try {
            setActionLoading(request.id!);
            await AccountService.updateRequestStatus(request.id!, 'approved', currentUser!.uid);
            setDeletionRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'approved' as const } : r));
        } catch (err) {
            console.error('Error approving deletion:', err);
            setError('Failed to approve deletion request');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectDeletion = async (requestId: string) => {
        try {
            setActionLoading(requestId);
            await AccountService.updateRequestStatus(requestId, 'rejected', currentUser!.uid);
            setDeletionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' as const } : r));
        } catch (err) {
            console.error('Error rejecting deletion:', err);
            setError('Failed to reject deletion request');
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
            case 'confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'completed': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const formatDateRange = (start: any, end: any) => {
        if (!start || !end) return 'N/A';
        const s = start.toDate ? start.toDate() : new Date(start);
        const e = end.toDate ? end.toDate() : new Date(end);

        // Calculate days
        const diffTime = Math.abs(e - s);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

        return (
            <div>
                <div className="font-medium text-slate-900 dark:text-white">
                    {s.toLocaleDateString()} - {e.toLocaleDateString()}
                </div>
                <div className="text-xs text-slate-500">
                    {diffDays} days
                </div>
            </div>
        );
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

                    {/* Main Tabs */}
                    <div className="flex bg-white dark:bg-surface-dark rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'listings'
                                ? 'bg-primary text-slate-900'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            Listings
                        </button>
                        <button
                            onClick={() => setActiveTab('deletions')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'deletions'
                                ? 'bg-primary text-slate-900'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            Deletion Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bookings'
                                ? 'bg-primary text-slate-900'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            Active Bookings
                        </button>
                    </div>

                    {/* Filter Toggle (only for listings) */}
                    {activeTab === 'listings' && (
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
                    )}

                    {/* Filter Toggle (only for bookings) */}
                    {activeTab === 'bookings' && (
                        <div className="flex bg-white dark:bg-surface-dark rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setBookingFilter('active')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${bookingFilter === 'active'
                                    ? 'bg-primary text-slate-900'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setBookingFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${bookingFilter === 'all'
                                    ? 'bg-primary text-slate-900'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                All History
                            </button>
                        </div>
                    )}
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
                ) : activeTab === 'listings' ? (
                    listings.length === 0 ? (
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
                    )
                ) : activeTab === 'deletions' ? (
                    deletionRequests.length === 0 ? (
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">person_remove</span>
                            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No deletion requests</h2>
                            <p className="text-slate-500 dark:text-slate-400">There are no pending account deletion requests at this time.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {deletionRequests.map((req) => (
                                <div key={req.id} className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-lg flex items-center justify-between gap-6 border border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{req.userEmail}</h3>
                                            <p className="text-xs text-slate-500">ID: {req.userId}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                Requested: {req.createdAt?.toDate?.().toLocaleString() || 'Recently'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {req.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleRejectDeletion(req.id!)}
                                                    disabled={actionLoading === req.id}
                                                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleApproveDeletion(req)}
                                                    disabled={actionLoading === req.id}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
                                                >
                                                    Approve Deletion
                                                </button>
                                            </>
                                        ) : (
                                            <span className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${req.status === 'approved' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}>
                                                {req.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    bookings.length === 0 ? (
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">calendar_month</span>
                            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No active bookings</h2>
                            <p className="text-slate-500 dark:text-slate-400">There are no bookings matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Equipment</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Seller Side</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Buyer Side</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Duration</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Price</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {bookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleListingLinkClick(booking.listingId)}
                                                        className="font-bold text-slate-900 dark:text-white hover:text-primary hover:underline text-left"
                                                    >
                                                        {booking.listingTitle}
                                                    </button>
                                                    <div className="text-xs text-slate-500">ID: {booking.listingId}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-slate-400 text-lg">storefront</span>
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-700 dark:text-slate-300">{booking.sellerName}</span>
                                                            <span className="text-xs text-slate-500">{booking.sellerPhone || 'No Phone'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-slate-400 text-lg">person</span>
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-700 dark:text-slate-300">{booking.renterName}</span>
                                                            <span className="text-xs text-slate-500">{booking.renterPhone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formatDateRange(booking.startDate, booking.endDate)}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-primary">
                                                    {formatCurrency(booking.totalPrice, i18n.language)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}
            </div >
        </div >
    );
};

export default AdminPanelScreen;
