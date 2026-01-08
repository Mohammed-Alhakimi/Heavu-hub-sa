import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    serverTimestamp,
    limit,
    startAfter,
    DocumentData,
    QueryDocumentSnapshot,
    Timestamp,
    doc,
    updateDoc,
    deleteDoc,
    getCountFromServer
} from 'firebase/firestore';
import { db } from '../firebase';
import { EquipmentListing } from '../types';

const LISTINGS_COLLECTION = 'listings';
const PAGE_SIZE = 12;

export interface GetListingsResult {
    listings: EquipmentListing[];
    lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

export const getListings = async (
    pageSize: number = PAGE_SIZE,
    lastVisible: QueryDocumentSnapshot<DocumentData> | null = null
): Promise<GetListingsResult> => {
    try {
        let q = query(
            collection(db, LISTINGS_COLLECTION),
            where('status', '==', 'active'),
            limit(pageSize)
        );

        if (lastVisible) {
            q = query(
                collection(db, LISTINGS_COLLECTION),
                where('status', '==', 'active'),
                startAfter(lastVisible),
                limit(pageSize)
            );
        }

        const snapshot = await getDocs(q);

        const listings: EquipmentListing[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            listings.push({
                id: doc.id,
                ...data,
                // Convert Timestamps to dates or serializable format if needed
                approvedAt: data.approvedAt?.toDate?.() || data.approvedAt,
                createdAt: data.createdAt?.toDate?.() || data.createdAt,
            } as EquipmentListing);
        });

        return {
            listings,
            lastVisible: snapshot.docs[snapshot.docs.length - 1] || null
        };
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
};

export const createListing = async (
    listingData: Omit<EquipmentListing, 'id' | 'status' | 'createdAt' | 'approvedAt'>
): Promise<string> => {
    try {
        // Force status to pending and set createdAt
        const newListing = {
            ...listingData,
            status: 'pending',
            createdAt: serverTimestamp(),
            approvedAt: null, // Not approved yet
            isAvailable: true, // Default to available
            isVerifiedDealer: false // Default/Logic to be determined
        };

        const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), newListing);
        return docRef.id;
    } catch (error) {
        console.error('Error creating listing:', error);
        throw error;
    }
};

// Admin only function (Stub for future use)
export const getPendingListings = async () => {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching pending listings:', error);
        throw error;
    }
};

/**
 * Updates a listing's status (Admin only)
 */
export const updateListingStatus = async (listingId: string, status: EquipmentListing['status']) => {
    try {
        const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
        const updateData: any = { status };

        // If approving, set approvedAt
        if (status === 'active') {
            updateData.approvedAt = serverTimestamp();
        }

        await updateDoc(listingRef, updateData);
    } catch (error) {
        console.error('Error updating listing status:', error);
        throw error;
    }
};

/**
 * Permanently deletes a listing (Admin only)
 */
export const deleteListing = async (listingId: string) => {
    try {
        const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
        await deleteDoc(listingRef);
    } catch (error) {
        console.error('Error deleting listing:', error);
        throw error;
    }
};

export const getListingsCount = async (): Promise<number> => {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('status', '==', 'active')
        );
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } catch (error) {
        console.error('Error getting listings count:', error);
        return 0;
    }
};
