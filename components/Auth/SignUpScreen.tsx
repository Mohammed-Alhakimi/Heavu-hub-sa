import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase'; // Adjust path if needed
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { formatPhoneNumber, isValidPhoneNumber } from '../../utils/phone';

interface SignUpScreenProps {
    onNavigateToLogin: () => void;
    onSignUpSuccess: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToLogin, onSignUpSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'buyer' | 'dealer'>('buyer');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            return setError('Please enter a valid Saudi phone number starting with +966 5');
        }

        try {
            setError('');
            setLoading(true);

            // 1. Create auth user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: fullName,
                phoneNumber: phoneNumber,
                role,
                isVerified: false,
                createdAt: serverTimestamp(),
                favorites: [],
                fcmTokens: []
            });

            onSignUpSuccess();
        } catch (err: any) {
            console.error(err);
            setError('Failed to create an account. ' + (err.message || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <span className="material-symbols-outlined text-primary text-3xl">construction</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Heavy Hub</h1>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Create a new account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-surface-dark py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-800">
                    <form className="space-y-4" onSubmit={handleSignUp}>
                        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">{error}</div>}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white outline-none focus:ring-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white outline-none focus:ring-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                            <div className="mt-1">
                                <input
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                                    placeholder="+966 5X XXX XXXX"
                                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white outline-none focus:ring-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">I am a...</label>
                            <div className="mt-1 grid grid-cols-2 gap-3">
                                <div
                                    onClick={() => setRole('buyer')}
                                    className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition-all ${role === 'buyer'
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Buyer / Renter
                                </div>
                                <div
                                    onClick={() => setRole('dealer')}
                                    className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition-all ${role === 'dealer'
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Dealer / Seller
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white outline-none focus:ring-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white outline-none focus:ring-1"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-lg border border-transparent bg-primary py-2.5 px-4 text-sm font-bold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{' '}
                        <button onClick={onNavigateToLogin} className="font-bold text-primary hover:text-primary-dark">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpScreen;
