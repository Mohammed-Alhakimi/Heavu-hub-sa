const {setGlobalOptions} = require("firebase-functions");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const axios = require("axios");

initializeApp();
const db = getFirestore();

setGlobalOptions({maxInstances: 10});

const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/d9mg1yzruihaa2w8i4cyaesomfs6apm9";

/**
 * Enriches and sends booking data to Make.com.
 * @param {object} event The Firestore event.
 * @return {Promise<void>}
 */
async function handleNewBooking(event) {
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

    const eRef = db.collection("listings").doc(equipmentId);
    const equipmentDoc = await eRef.get();
    const equipmentData = equipmentDoc.exists ? equipmentDoc.data() : {};

    let customerData = {};
    const userId = bookingData.userId || bookingData.renterId;
    if (userId) {
      const uRef = db.collection("users").doc(userId);
      const userDoc = await uRef.get();
      if (userDoc.exists) {
        customerData = userDoc.data();
      }
    }

    const startDate = bookingData.startDate?.toDate ?
      bookingData.startDate.toDate() : new Date(bookingData.startDate);
    const endDate = bookingData.endDate?.toDate ?
      bookingData.endDate.toDate() : new Date(bookingData.endDate);

    const payload = {
      bookingId: bookingId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice: bookingData.totalPrice || 0,
      status: bookingData.status || "pending",
      equipmentId: equipmentId,
      equipmentName: equipmentData.name ||
        equipmentData.title ||
        bookingData.listingTitle ||
        "Unknown Equipment",
      supplierId: bookingData.sellerId || equipmentData.sellerId,
      customerId: userId,
      customerName: customerData.displayName ||
        bookingData.renterName ||
        "Unknown Customer",
      customerEmail: customerData.email || "",
      customerPhone: customerData.phoneNumber ||
        bookingData.renterPhone || "",
      createdAt: new Date().toISOString(),
    };

    console.log(`Sending payload to Make.com for booking ${bookingId}`);
    const response = await axios.post(MAKE_WEBHOOK_URL, payload, {
      headers: {"Content-Type": "application/json"},
      timeout: 10000,
    });

    console.log(`Successfully sent booking ${bookingId} ` +
      `to Make.com. Status: ${response.status}`);
  } catch (error) {
    console.error(`Error processing booking ${bookingId}:`, error.message);
  }
}

exports.onNewBookingCreated = onDocumentCreated(
    "bookings/{bookingId}",
    handleNewBooking,
);
