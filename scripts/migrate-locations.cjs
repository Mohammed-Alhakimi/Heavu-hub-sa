const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateLocations() {
    console.log('Starting location migration...');
    const listingsRef = db.collection('listings');
    const snapshot = await listingsRef.get();

    if (snapshot.empty) {
        console.log('No listings found.');
        return;
    }

    const batch = db.batch();
    let count = 0;

    snapshot.forEach(doc => {
        const data = doc.data();
        // If location is missing or is not a valid city ID, set it to riyadh
        if (!data.location || typeof data.location !== 'string' || data.location.includes(',')) {
            batch.update(doc.ref, { location: 'riyadh' });
            count++;
        }
    });

    if (count > 0) {
        await batch.commit();
        console.log(`Successfully updated ${count} listings with default location 'riyadh'.`);
    } else {
        console.log('No listings needed updating.');
    }

    process.exit(0);
}

migrateLocations().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
