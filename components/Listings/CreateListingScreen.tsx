import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { EquipmentCategory } from '../../types';
import { createListing } from '../../services/listings';
import { SAUDI_CITIES } from '../../constants';

interface CreateListingScreenProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const CreateListingScreen: React.FC<CreateListingScreenProps> = ({ onSuccess, onCancel }) => {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<string>('');
    const [listingType, setListingType] = useState<'sale' | 'rent' | 'both'>('both');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState<number>(new Date().getFullYear());

    // Pricing
    const [buyPrice, setBuyPrice] = useState<string>('');
    const [rentDaily, setRentDaily] = useState<string>('');
    const [rentMonthly, setRentMonthly] = useState<string>('');

    // Specs
    const [hours, setHours] = useState<string>('');
    const [weight, setWeight] = useState('');
    const [power, setPower] = useState('');

    // Location
    const [city, setCity] = useState('');

    // Images
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + imageFiles.length > 10) {
            setError('Maximum 10 images allowed');
            return;
        }

        setImageFiles(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async (): Promise<string[]> => {
        const uploadPromises = imageFiles.map(async (file, index) => {
            const fileName = `${Date.now()}_${index}_${file.name}`;
            const storageRef = ref(storage, `listings/${currentUser?.uid}/${fileName}`);
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
        });
        return Promise.all(uploadPromises);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            setError('You must be logged in to create a listing');
            return;
        }

        // Title validation: Max 32 chars, alphanumeric and spaces only
        const titleRegex = /^[a-zA-Z0-9 ]*$/;
        if (!titleRegex.test(title) || title.length > 32) {
            setError('Title must be max 32 characters and contain only letters, numbers, and spaces');
            return;
        }

        // Make validation: Max 32 chars, alphanumeric and spaces only
        if (!titleRegex.test(make) || make.length > 32) {
            setError('Make must be max 32 characters and contain only letters, numbers, and spaces');
            return;
        }

        // Model validation: alphanumeric only
        const alphanumericRegex = /^[a-zA-Z0-9]*$/;
        if (!alphanumericRegex.test(model)) {
            setError('Model must contain only letters and numbers');
            return;
        }

        // Hours validation: optional positive integer (default to 0)
        let hoursNum = 0;
        if (hours) {
            hoursNum = parseInt(hours);
            if (isNaN(hoursNum) || hoursNum < 0) {
                setError('Hours must be a positive integer');
                return;
            }
        }

        // Weight validation: optional positive integer (default to 0)
        let weightNum = 0;
        if (weight) {
            if (!/^\d+$/.test(weight)) {
                setError('Weight must be a positive integer');
                return;
            }
            weightNum = parseInt(weight);
        }

        // Power validation: positive integer and letters
        if (power && !/^[a-zA-Z0-9]*$/.test(power)) {
            setError('Power must contain only letters and numbers');
            return;
        }

        // Prices validation: positive integers
        const validatePrice = (p: string) => (/^\d+$/.test(p) && parseInt(p) >= 0);
        if (listingType === 'rent' || listingType === 'both') {
            if (!rentDaily || !rentMonthly || !validatePrice(rentDaily) || !validatePrice(rentMonthly)) {
                setError('Daily and Monthly rates are mandatory and must be positive integers');
                return;
            }
        }
        if (listingType === 'sale' || listingType === 'both') {
            if (!buyPrice || !validatePrice(buyPrice)) {
                setError('Buy price is required and must be a positive integer');
                return;
            }
        }

        if (!title || !category || !make || !model || !city) {
            setError(t('Please fill in all required fields'));
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Upload images first
            const imageUrls = await uploadImages();

            // Create listing using service
            await createListing({
                sellerId: currentUser.uid,
                // Map to flat structure for compatibility
                name: title,
                title, // Keep original
                description,
                category,
                // Flatten IDs
                make,
                model,
                year,
                serialNumber: 'N/A', // Default or add field

                // Flatten Price
                buyPrice: buyPrice ? parseInt(buyPrice) : 0,
                rentDaily: rentDaily ? parseInt(rentDaily) : 0,
                rentMonthly: rentMonthly ? parseInt(rentMonthly) : 0,

                // Flatten Specs
                hours: hoursNum,
                weight: weightNum,
                netPower: power || undefined,

                // Location
                location: city, // City ID

                // Boolean flags (derive from listingType)
                forSale: listingType === 'sale' || listingType === 'both',
                forRent: listingType === 'rent' || listingType === 'both',
                type: listingType,

                price: {
                    buy: buyPrice ? parseInt(buyPrice) : null,
                    rentDaily: rentDaily ? parseInt(rentDaily) : null,
                    rentMonthly: rentMonthly ? parseInt(rentMonthly) : null,
                    currency: 'SAR'
                },
                specs: {
                    hours: hoursNum,
                    weight: weightNum,
                    power: power || null
                },
                images: imageUrls,
                // Status and timestamps are handled by the service
            } as any);

            onSuccess();
        } catch (err: any) {
            console.error('Error creating listing:', err);
            setError('Failed to create listing. ' + (err.message || ''));
        } finally {
            setLoading(false);
        }
    };

    const categories = Object.values(EquipmentCategory);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            List Your Equipment
                        </h1>
                        <button
                            onClick={onCancel}
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Pending Notice */}
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 flex-shrink-0">info</span>
                        <div>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Review Required</p>
                            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">Your listing will be reviewed by our team before going live. This usually takes 24-48 hours.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <section>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., 2020 CAT 320 Excavator"
                                        maxLength={32}
                                        pattern="[a-zA-Z0-9 ]*"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        placeholder="Describe your equipment..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    >
                                        <option value="">{t('select_category') || 'Select category'}</option>
                                        {Object.entries(EquipmentCategory).map(([key, value]) => (
                                            <option key={key} value={value}>
                                                {t(`cat_${key.toLowerCase()}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Listing Type
                                    </label>
                                    <select
                                        value={listingType}
                                        onChange={(e) => setListingType(e.target.value as 'sale' | 'rent' | 'both')}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="both">For Sale & Rent</option>
                                        <option value="sale">For Sale Only</option>
                                        <option value="rent">For Rent Only</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Equipment Details */}
                        <section>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">construction</span>
                                Equipment Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Make *
                                    </label>
                                    <input
                                        type="text"
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                        placeholder="e.g., Caterpillar"
                                        maxLength={32}
                                        pattern="[a-zA-Z0-9 ]*"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Model *
                                    </label>
                                    <input
                                        type="text"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        placeholder="e.g., 320GC"
                                        pattern="[a-zA-Z0-9]*"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Year
                                    </label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        {Array.from({ length: new Date().getFullYear() - 1980 + 2 }, (_, i) => 1980 + i).slice().reverse().map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Hours
                                    </label>
                                    <input
                                        type="number"
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                        placeholder="e.g., 3500"
                                        min="0"
                                        step="1"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Weight
                                    </label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="e.g., 22000"
                                        min="0"
                                        step="1"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Power
                                    </label>
                                    <input
                                        type="text"
                                        value={power}
                                        onChange={(e) => setPower(e.target.value)}
                                        placeholder="e.g., 162 hp"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Pricing */}
                        <section>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">payments</span>
                                Pricing (SAR)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {(listingType === 'sale' || listingType === 'both') && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Buy Price
                                        </label>
                                        <input
                                            type="number"
                                            value={buyPrice}
                                            onChange={(e) => setBuyPrice(e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            step="1"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                )}
                                {(listingType === 'rent' || listingType === 'both') && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Daily Rate *
                                            </label>
                                            <input
                                                type="number"
                                                value={rentDaily}
                                                onChange={(e) => setRentDaily(e.target.value)}
                                                placeholder="0"
                                                min="0"
                                                step="1"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Monthly Rate *
                                            </label>
                                            <input
                                                type="number"
                                                value={rentMonthly}
                                                onChange={(e) => setRentMonthly(e.target.value)}
                                                placeholder="0"
                                                min="0"
                                                step="1"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Location */}
                        <section>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                {t('location')}
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    {t('location')} *
                                </label>
                                <select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                >
                                    <option value="">{t('select_location') || 'Select Location'}</option>
                                    {SAUDI_CITIES.map(cid => (
                                        <option key={cid} value={cid}>
                                            {t(`cities.${cid}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        {/* Images */}
                        <section>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">photo_library</span>
                                Photos
                            </h2>
                            <div
                                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">add_photo_alternate</span>
                                <p className="text-slate-600 dark:text-slate-400">Click to upload images</p>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Maximum 10 images</p>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Submit */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 py-3 px-6 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">publish</span>
                                        Publish Listing
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateListingScreen;
