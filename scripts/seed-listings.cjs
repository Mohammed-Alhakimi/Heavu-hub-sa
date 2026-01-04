const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedListings() {
    console.log('Seeding dummy listings...');
    const listingsRef = db.collection('listings');
    const batch = db.batch();

    const cities = ['riyadh', 'jeddah', 'dammam', 'mecca', 'medina'];

    for (let i = 1; i <= 15; i++) {
        const docRef = listingsRef.doc();
        batch.set(docRef, {
            name: `Dummy Equipment ${i}`,
            title: `Excavator Model X${i}`,
            category: 'Excavators',
            make: 'Caterpillar',
            model: `X${i}`,
            year: 2020 + (i % 5),
            location: cities[i % cities.length],
            buyPrice: 100000 + (i * 10000),
            rentDaily: 500 + (i * 50),
            images: ['https://placehold.co/600x400?text=Excavator+' + i],
            status: 'active',
            isAvailable: true,
            forSale: i % 2 === 0,
            forRent: true,
            approvedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            sellerId: 'dummy-seller'
        });
    }

    await batch.commit();
    console.log('Successfully seeded 15 dummy listings.');
    process.exit(0);
}

seedListings().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
