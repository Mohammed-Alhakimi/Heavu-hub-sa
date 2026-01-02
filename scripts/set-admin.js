import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

// Get arguments
const args = process.argv.slice(2);
const help = args.includes('--help') || args.includes('-h');
const email = args[0];

if (help || !email) {
    console.log(`
Usage: node scripts/set-admin.js <email>

Description:
  Promotes the user with the given email address to the 'admin' role.
  Requires 'service-account.json' to be present in the project root.

Arguments:
  <email>    The email address of the user to promote
`);
    process.exit(help ? 0 : 1);
}

// Load service account
let serviceAccount;
try {
    const serviceAccountPath = join(process.cwd(), 'service-account.json');
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
    console.error('Error: Could not load service-account.json');
    console.error('Please download your service account key from Firebase Console -> Project Settings -> Service Accounts');
    console.error('Save it as "service-account.json" in the project root directory.');
    process.exit(1);
}

// Initialize Firebase Admin
initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

async function setAdmin() {
    try {
        // 1. Find user by email to get UID
        console.log(`Looking up user ${email}...`);
        const user = await auth.getUserByEmail(email);
        const uid = user.uid;
        console.log(`Found user ${uid}`);

        // 2. Update Firestore document
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.error(`User document for ${uid} does not exist in 'users' collection.`);
            console.log('Attempting to create it...');
            await userRef.set({
                email: email,
                role: 'admin',
                createdAt: new Date().toISOString()
            }, { merge: true });
        } else {
            await userRef.update({
                role: 'admin'
            });
        }

        // 3. Set Custom User Claims (optional, but good practice for security rules if using request.auth.token.admin)
        await auth.setCustomUserClaims(uid, { admin: true, role: 'admin' });

        console.log(`Successfully promoted ${email} to admin!`);
        console.log('You may need to sign out and sign back in for changes to take effect in the client.');

    } catch (error) {
        console.error('Error setting admin:', error);
        process.exit(1);
    }
}

setAdmin();
