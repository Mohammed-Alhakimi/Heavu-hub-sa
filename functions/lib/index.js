"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNewBookingCreated = void 0;
const functions = require("firebase-functions");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const axios_1 = require("axios");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/cnjoop4rlsl34vyezjt3vgv77tiwzv91";
/**
 * RFQ-First Cloud Function (V1)
 * Triggers when a new booking document is created.
 */
exports.onNewBookingCreated = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate(async (snapshot, context) => {
    var _a, _b, _c;
    const bookingId = context.params.bookingId;
    const bookingData = snapshot.data();
    if (!bookingData) {
        console.error("No data associated with the event");
        return;
    }
    console.log(`New booking created: ${bookingId}`);
    try {
        // 1. Fetch related equipment document
        const equipmentId = bookingData.equipmentId;
        if (!equipmentId) {
            console.error(`Booking ${bookingId} is missing equipmentId`);
            return;
        }
        const equipmentDoc = await db.collection("listings").doc(equipmentId).get();
        if (!equipmentDoc.exists) {
            console.error(`Equipment ${equipmentId} not found for booking ${bookingId}`);
            return;
        }
        const equipmentData = equipmentDoc.data();
        // 2. Fetch related renter (user) profile (optional)
        let customerData = {};
        const userId = bookingData.userId || bookingData.renterId;
        if (userId) {
            const userDoc = await db.collection("users").doc(userId).get();
            if (userDoc.exists) {
                customerData = userDoc.data();
            }
        }
        // 3. Calculate duration and pricing
        const startDate = ((_a = bookingData.startDate) === null || _a === void 0 ? void 0 : _a.toDate) ? bookingData.startDate.toDate() : new Date(bookingData.startDate);
        const endDate = ((_b = bookingData.endDate) === null || _b === void 0 ? void 0 : _b.toDate) ? bookingData.endDate.toDate() : new Date(bookingData.endDate);
        const durationMs = endDate.getTime() - startDate.getTime();
        const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
        const retailRate = equipmentData.rentDaily || equipmentData.retailRate || 0;
        const subtotal = retailRate * durationDays;
        const vat = subtotal * 0.15;
        const totalEstimatedPrice = subtotal + vat;
        // 4. Construct the payload
        const payload = {
            // Request details
            bookingId: bookingId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            duration_days: durationDays,
            // Financials
            retailRate: retailRate,
            subtotal: subtotal,
            vat: vat,
            total_estimated_price: totalEstimatedPrice,
            // Equipment details
            equipmentId: equipmentId,
            equipmentName: equipmentData.name || equipmentData.title || "Unknown Equipment",
            supplierName: equipmentData.sellerName || ((_c = equipmentData.seller) === null || _c === void 0 ? void 0 : _c.name) || "Unknown Supplier",
            supplierId: equipmentData.sellerId,
            // Customer details
            customerId: userId,
            customerName: customerData.displayName || customerData.fullName || bookingData.renterName || "Unknown Customer",
            customerEmail: customerData.email || bookingData.renterEmail || "",
            customerPhone: customerData.phoneNumber || bookingData.renterPhone || "",
            // Additional context
            status: bookingData.status || "pending",
            createdAt: new Date().toISOString(),
            notes: bookingData.notes || ""
        };
        console.log(`Sending payload to Make.com for booking ${bookingId}:`, JSON.stringify(payload));
        // 5. Send to Make.com webhook
        const response = await axios_1.default.post(MAKE_WEBHOOK_URL, payload, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000 // 10 second timeout
        });
        console.log(`Make.com webhook response for booking ${bookingId}: Status ${response.status}`);
    }
    catch (error) {
        console.error(`Error processing booking ${bookingId}:`, error.message);
        if (error.response) {
            console.error(`Webhook response error: Status ${error.response.status}`, error.response.data);
        }
    }
});
//# sourceMappingURL=index.js.map