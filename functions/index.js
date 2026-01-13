const { setGlobalOptions } = require("firebase-functions");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");

initializeApp();
const db = getFirestore();

"bookings/{bookingId}",
    async (event) => {
        // ...
    }
);
*/

const { defineSecret } = require("firebase-functions/params");
const emailPassword = defineSecret("EMAIL_PASSWORD");

exports.onNewBookingCreated = onDocumentCreated(
    {
        document: "bookings/{bookingId}",
        secrets: [emailPassword],
        maxInstances: 10,
    },
    async (event) => {
        const EMAIL_USER = "MOHAMMEDXNABIL@GMAIL.COM";

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USER,
                pass: emailPassword.value(),
            },
        });

        const bookingId = event.params.bookingId;
        const bookingData = event.data?.data();

        if (!bookingData) {
            console.error("No data associated with the event");
            return;
        }

        console.log(`New booking created: ${bookingId}. Preparing emails...`);

        try {
            // 1. Fetch Additional Data (Equipment, Buyer, Seller)
            const equipmentId = bookingData.listingId || bookingData.equipmentId;
            const buyerId = bookingData.userId || bookingData.renterId;
            const sellerId = bookingData.sellerId;

            const [equipmentDoc, buyerDoc, sellerDoc] = await Promise.all([
                equipmentId ? db.collection("listings").doc(equipmentId).get() : null,
                buyerId ? db.collection("users").doc(buyerId).get() : null,
                sellerId ? db.collection("users").doc(sellerId).get() : null,
            ]);

            const equipment = equipmentDoc?.exists ? equipmentDoc.data() : {};
            const buyer = buyerDoc?.exists ? buyerDoc.data() : {};
            const seller = sellerDoc?.exists ? sellerDoc.data() : {};

            const equipmentName = equipment.name ||
                equipment.title ||
                bookingData.listingTitle ||
                "Heavy Equipment";
            const startDate = bookingData.startDate?.toDate ?
                bookingData.startDate.toDate().toDateString() :
                new Date(bookingData.startDate).toDateString();
            const endDate = bookingData.endDate?.toDate ?
                bookingData.endDate.toDate().toDateString() :
                new Date(bookingData.endDate).toDateString();

            // 2. Send Email to Seller (Notification)
            // Only send if we have a valid seller email
            if (seller.email) {
                const sellerMailOptions = {
                    from: `"Heavy Hub" <${EMAIL_USER}>`,
                    to: seller.email,
                    subject: `New Booking Request: ${equipmentName}`,
                    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #4F46E5;">New Booking Request</h2>
              <p>Hello,</p>
              <p>You have received a new booking request for your <strong>${equipmentName}</strong>.</p>
              
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Renter:</strong> ${buyer.displayName || "Guest via Heavy Hub"}</p>
                <p><strong>Dates:</strong> ${startDate} to ${endDate}</p>
                <p><strong>Total Price:</strong> SAR ${bookingData.totalPrice || "N/A"}</p>
              </div>

              <p>Please log in to your dashboard to review and manage this request.</p>
              <a href="https://your-website-url.com/my-fleet" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Go to Dashboard</a>
            </div>
            `,
                };

                await transporter.sendMail(sellerMailOptions);
                console.log(`Email sent to Seller: ${seller.email}`);
            } else {
                console.warn(`Seller email not found for ID: ${sellerId}`);
            }

            // 3. Send Email to Buyer (Confirmation)
            if (buyer.email) {
                const buyerMailOptions = {
                    from: `"Heavy Hub" <${EMAIL_USER}>`,
                    to: buyer.email,
                    subject: `Booking Confirmation: ${equipmentName}`,
                    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #10B981;">Booking Received</h2>
              <p>Hi ${buyer.displayName || "there"},</p>
              <p>We have received your booking request for <strong>${equipmentName}</strong>.</p>
              
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Dates:</strong> ${startDate} to ${endDate}</p>
                <p><strong>Status:</strong> ${bookingData.status || "Pending"}</p>
                <p><strong>Total Price:</strong> SAR ${bookingData.totalPrice || "0"}</p>
              </div>

              <p>The seller has been notified and will review your request shortly.</p>
              <p>Thank you for using Heavy Hub!</p>
            </div>
            `,
                };

                await transporter.sendMail(buyerMailOptions);
                console.log(`Email sent to Buyer: ${buyer.email}`);
            } else {
                console.warn(`Buyer email not found for ID: ${buyerId}`);
            }
        } catch (error) {
            console.error("Error processing booking email:", error);
        }
    }
);
