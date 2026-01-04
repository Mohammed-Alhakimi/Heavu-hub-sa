import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { Booking } from '../types';

export const BookingService = {
    /**
     * Creates a new booking in Firestore
     */
    async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
        return addDoc(collection(db, 'bookings'), {
            ...booking,
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    },

    /**
     * Checks if there are any conflicting bookings for a given time range
     */
    async checkConflict(listingId: string, startDate: Date, endDate: Date): Promise<boolean> {
        const bookingsRef = collection(db, 'bookings');

        // Query for potentially overlapping bookings
        // Overlap conditions:
        // (S1 < E2) AND (S2 < E1)
        const q = query(
            bookingsRef,
            where('listingId', '==', listingId),
            where('status', 'in', ['pending', 'confirmed'])
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.some(doc => {
            const data = doc.data();
            const bStart = (data.startDate as Timestamp).toDate();
            const bEnd = (data.endDate as Timestamp).toDate();

            return (startDate < bEnd && bStart < endDate);
        });
    },

    /**
     * Fetches all non-cancelled bookings for a listing to visualize on calendar
     */
    async getBookedDates(listingId: string) {
        const q = query(
            collection(db, 'bookings'),
            where('listingId', '==', listingId),
            where('status', 'in', ['pending', 'confirmed'])
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            start: (doc.data().startDate as Timestamp).toDate(),
            end: (doc.data().endDate as Timestamp).toDate()
        }));
    }
};
