import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import { SAUDI_CITIES } from '../constants';
import { AccountService } from '../services/AccountService';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { formatPhoneNumber, isValidPhoneNumber } from '../utils/phone';

interface ProfileEditScreenProps {
    onBack: () => void;
    onSuccess: () => void;
}

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({ onBack, onSuccess }) => {
    const { currentUser, profile, refreshProfile, userRole } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [displayName, setDisplayName] = useState(profile?.displayName || '');
    const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
    const [companyName, setCompanyName] = useState(profile?.companyName || '');
    const [location, setLocation] = useState(profile?.location || '');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState(profile?.photoURL || '');

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName || (currentUser?.displayName || ''));
            setPhoneNumber(profile.phoneNumber || '');
            setCompanyName(profile.companyName || '');
            setLocation(profile.location || '');
            setPhotoPreview(profile.photoURL || (currentUser?.photoURL || ''));
        } else if (currentUser) {
            setDisplayName(currentUser.displayName || '');
            setPhotoPreview(currentUser.photoURL || '');
        }
    }, [profile, currentUser]);

    // Account Deletion State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteStep, setDeleteStep] = useState(1);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [hasPendingDelete, setHasPendingDelete] = useState(false);

    useEffect(() => {
        const checkPending = async () => {
            if (currentUser?.uid) {
                const pending = await AccountService.hasPendingRequest(currentUser.uid);
                setHasPendingDelete(pending);
            }
        };
        checkPending();
    }, [currentUser]);

    const handleDeleteRequest = async () => {
        if (!password || !confirmPassword) {
            setDeleteError('Please enter both password fields');
            return;
        }

        if (password !== confirmPassword) {
            setDeleteError('Passwords do not match');
            return;
        }

        if (userRole === 'admin') {
            setDeleteError('Admins cannot delete their own accounts');
            return;
        }

        setLoading(true);
        setDeleteError('');

        try {
            // Optional: Actually verify the password with Firebase before creating the request
            // This ensures the request is legitimate.
            const credential = EmailAuthProvider.credential(currentUser!.email!, password);
            await reauthenticateWithCredential(currentUser!, credential);

            await AccountService.createDeletionRequest({
                userId: currentUser!.uid,
                userEmail: currentUser!.email!,
            });

            setSuccess('Deletion request sent to admin for approval');
            setHasPendingDelete(true);
            setShowDeleteModal(false);
        } catch (err: any) {
            console.error('Error creating deletion request:', err);
            setDeleteError(err.message || 'Failed to verify password or create request');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size must be less than 2MB');
                return;
            }
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser?.uid) {
            setError('You must be logged in to edit your profile');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!displayName || !phoneNumber || !location) {
                throw new Error('Please fill in all required fields');
            }

            if (!isValidPhoneNumber(phoneNumber)) {
                throw new Error('Please enter a valid Saudi phone number starting with +966 5');
            }

            let photoURL = photoPreview;

            if (photoFile) {
                const storageRef = ref(storage, `profiles/${currentUser.uid}/${Date.now()}_${photoFile.name}`);
                await uploadBytes(storageRef, photoFile);
                photoURL = await getDownloadURL(storageRef);
            }

            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                displayName,
                phoneNumber,
                companyName: companyName || null,
                location,
                photoURL,
                updatedAt: serverTimestamp()
            });

            await refreshProfile();
            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err: any) {
            console.error('Error updating profile:', err);
            // Handle case where document doesn't exist yet
            if (err.code === 'not-found') {
                try {
                    // This shouldn't happen if they are logged in and we have a doc policy,
                    // but for robustness we could handle creation here if needed.
                    // However, updateDoc requires existence.
                } catch (createErr) { }
            }
            setError(err.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Edit Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm font-medium">
                        {success}
                    </div>
                )}

                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-md group">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl">person</span>
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined text-white">camera_alt</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                    </div>
                    <span className="text-sm font-bold text-slate-500">Change Profile Photo</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="+966 5X XXX XXXX"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Company Name (Optional)
                    </label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Your company name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        required
                    >
                        <option value="">Select City</option>
                        {SAUDI_CITIES.map(city => (
                            <option key={city} value={city}>{t(`cities.${city}`)}</option>
                        ))}
                    </select>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-12 pt-8 border-t border-red-100 dark:border-red-900/30">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Once you request account deletion, an admin will review your request. This action is permanent and cannot be undone once approved.
                </p>
                {hasPendingDelete ? (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 p-4 rounded-xl text-sm font-medium">
                        You have a pending account deletion request.
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            if (userRole === 'admin') {
                                setError('Admins cannot delete their own accounts.');
                                return;
                            }
                            setShowDeleteModal(true);
                            setDeleteStep(1);
                        }}
                        className="px-6 py-3 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        Delete My Account
                    </button>
                )}
            </div>

            {/* Account Deletion Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        {deleteStep === 1 ? (
                            <div className="p-8">
                                <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-6">
                                    <span className="material-symbols-outlined text-4xl">warning</span>
                                </div>
                                <h3 className="text-2xl font-black text-center text-slate-900 dark:text-white mb-2">Delete Account?</h3>
                                <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
                                    This will send a request to the admin to permanently delete your account and all associated data.
                                </p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setDeleteStep(2)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all"
                                    >
                                        I Understand, Continue
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="w-full text-slate-500 font-bold py-2 hover:text-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Confirm Password</h3>
                                {deleteError && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6">
                                        {deleteError}
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Enter Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-red-500/50"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-red-500/50"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button
                                        onClick={handleDeleteRequest}
                                        disabled={loading}
                                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            "Confirm Request"
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setDeleteStep(1)}
                                        className="w-full text-slate-500 font-bold py-2 hover:text-slate-700 transition-colors"
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileEditScreen;
