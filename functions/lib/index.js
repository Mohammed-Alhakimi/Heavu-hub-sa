"use strict";
const __importDefault = (this && this.__importDefault) || function(mod) {
  return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.onNewBookingCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
const axios_1 = __importDefault(require("axios"));
(0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/d9mg1yzruihaa2w8i4cyaesomfs6apm9";
exports.onNewBookingCreated = (0, firestore_1.onDocumentCreated)("bookings/{bookingId}", async (event) => {
  const bookingId = event.params.bookingId;
  const bookingData = event.data?.data();
  if (!bookingData) {
    console.error("No data associated with the event");
    return;
  }
  console.log(`New booking created: ${bookingId}`);
  try {
    const equipmentId = bookingData.listingId || bookingData.equipmentId;
    if (!equipmentId) {
      console.error(`Booking ${bookingId} is missing listingId/equipmentId`);
      return;
    }
    const equipmentDoc = await db.collection("listings").doc(equipmentId).get();
    if (!equipmentDoc.exists) {
      console.error(`Equipment ${equipmentId} not found for booking ${bookingId}`);
      return;
    }
    const equipmentData = equipmentDoc.data() || {};
    let customerData = {};
    const userId = bookingData.userId || bookingData.renterId;
    if (userId) {
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists) {
        customerData = userDoc.data();
      }
    }
    const startDate = bookingData.startDate?.toDate ? bookingData.startDate.toDate() : new Date(bookingData.startDate);
    const endDate = bookingData.endDate?.toDate ? bookingData.endDate.toDate() : new Date(bookingData.endDate);
    const payload = {
      bookingId: bookingId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice: bookingData.totalPrice || 0,
      status: bookingData.status || "pending",
      equipmentId: equipmentId,
      equipmentName: equipmentData.name || equipmentData.title || "Unknown Equipment",
      supplierId: bookingData.sellerId || equipmentData.sellerId,
      customerId: userId,
      customerName: customerData.displayName || bookingData.renterName || "Unknown Customer",
      customerEmail: customerData.email || "",
      customerPhone: customerData.phoneNumber || bookingData.renterPhone || "",
      createdAt: new Date().toISOString(),
    };
    console.log(`Sending payload to Make.com for booking ${bookingId}`);
    const response = await axios_1.default.post(MAKE_WEBHOOK_URL, payload, {
      headers: {"Content-Type": "application/json"},
      timeout: 10000,
    });
    console.log(`Successfully sent booking ${bookingId} to Make.com. Status: ${response.status}`);
  } catch (error) {
    console.error(`Error processing booking ${bookingId}:`, error.message);
  }
});
// # sourceMappingURL=index.js.map
