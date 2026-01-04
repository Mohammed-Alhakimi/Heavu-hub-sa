import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { DeletionRequest } from '../types';

export const AccountService = {
    /**
     * Creates a new account deletion request
     */
    async createDeletionRequest(request: Omit<DeletionRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
        return addDoc(collection(db, 'deletionRequests'), {
            ...request,
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    },

    /**
     * Fetches all deletion requests for admin panel
     */
    async getDeletionRequests(status?: 'pending' | 'approved' | 'rejected') {
        let q = collection(db, 'deletionRequests');

        let firestoreQuery;
        if (status) {
            firestoreQuery = query(q, where('status', '==', status));
        } else {
            firestoreQuery = query(q);
        }

        const snapshot = await getDocs(firestoreQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as any)
        })) as DeletionRequest[];
    },

    /**
     * Updates the status of a deletion request
     */
    async updateRequestStatus(requestId: string, status: 'approved' | 'rejected', adminId: string) {
        const requestRef = doc(db, 'deletionRequests', requestId);
        const updateData: any = {
            status,
            updatedAt: serverTimestamp(),
            approvedBy: adminId
        };

        if (status === 'approved') {
            updateData.approvedAt = serverTimestamp();
        }

        return updateDoc(requestRef, updateData);
    },

    /**
     * Checks if a user already has a pending deletion request
     */
    async hasPendingRequest(userId: string): Promise<boolean> {
        const q = query(
            collection(db, 'deletionRequests'),
            where('userId', '==', userId),
            where('status', '==', 'pending')
        );
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    }
};
