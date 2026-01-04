// Script to delete all listings from Firestore
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
    await readFile(join(__dirname, '../service-account.json'), 'utf8')
);

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function deleteAllListings() {
    console.log('🗑️  Deleting all listings from Firestore...\n');

    const listingsRef = db.collection('listings');
    const snapshot = await listingsRef.get();

    if (snapshot.empty) {
        console.log('✅ No listings found in the database.');
        return;
    }

    console.log(`Found ${snapshot.size} listing(s) to delete.\n`);

    const batch = db.batch();
    let count = 0;

    snapshot.docs.forEach((doc) => {
        console.log(`  - Deleting: ${doc.id}`);
        batch.delete(doc.ref);
        count++;
    });

    await batch.commit();

    console.log(`\n✅ Successfully deleted ${count} listing(s).`);
}

deleteAllListings()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error deleting listings:', error);
        process.exit(1);
    });
