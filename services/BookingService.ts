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
    Timestamp,
    orderBy
} from 'firebase/firestore';
import { Booking } from '../types';

export const BookingService = {
    /**
     * Creates a new booking in Firestore
     * @param booking - Booking data (without id, timestamps, and status)
     * @returns The document reference of the created booking
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
     * Checks if there are any conflicting bookings for a given listing and date range
     * A conflict exists if: (newStart < existingEnd) AND (existingStart < newEnd)
     */
    async checkConflict(listingId: string, startDate: Date, endDate: Date): Promise<boolean> {
        const q = query(
            collection(db, 'bookings'),
            where('listingId', '==', listingId),
            where('status', 'in', ['pending', 'confirmed'])
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.some(doc => {
            const data = doc.data();
            const existingStart = (data.startDate as Timestamp).toDate();
            const existingEnd = (data.endDate as Timestamp).toDate();
            return startDate < existingEnd && existingStart < endDate;
        });
    },

    /**
     * Gets all booked date ranges for a listing (to disable on calendar)
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
    },

    /**
     * Gets all bookings for a specific user (renter)
     */
    async getUserBookings(userId: string): Promise<Booking[]> {
        const q = query(
            collection(db, 'bookings'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Booking));
    },

    /**
     * Gets all bookings for a seller's equipment
     */
    async getSellerBookings(sellerId: string): Promise<Booking[]> {
        const q = query(
            collection(db, 'bookings'),
            where('sellerId', '==', sellerId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Booking));
    },

    /**
     * Updates the status of a booking
     */
    async updateStatus(bookingId: string, status: Booking['status']) {
        const bookingRef = doc(db, 'bookings', bookingId);
        return updateDoc(bookingRef, {
            status,
            updatedAt: serverTimestamp()
        });
    },

    /**
     * Cancels a booking
     */
    async cancelBooking(bookingId: string) {
        return this.updateStatus(bookingId, 'cancelled');
    },

    /**
     * Confirms a booking (seller action)
     */
    async confirmBooking(bookingId: string) {
        return this.updateStatus(bookingId, 'confirmed');
    }
};
