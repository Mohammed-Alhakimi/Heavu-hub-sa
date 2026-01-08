
import React from 'react';
import { useTranslation } from 'react-i18next';

interface StepProps {
    number: number;
    title: string;
    description: string | React.ReactNode;
    icon: string;
    isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon, isLast }) => {
    return (
        <div className="relative flex gap-8 pb-16 last:pb-0 group">
            {!isLast && (
                <div className="absolute left-[27px] top-[60px] bottom-0 w-[2px] bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/20 transition-colors" />
            )}

            <div className="relative shrink-0 w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center text-primary group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {number}
                </div>
            </div>

            <div className="flex-1 pt-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base space-y-4">
                    {description}
                </div>
            </div>
        </div>
    );
};

interface HowItWorksScreenProps {
    onBack: () => void;
    onCreateListing: () => void;
    onBrowseMachinery: () => void;
}

const HowItWorksScreen: React.FC<HowItWorksScreenProps> = ({ onBack, onCreateListing, onBrowseMachinery }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    const steps = [
        {
            number: 1,
            title: "1. Listing & Discovery",
            icon: "inventory_2",
            description: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">For Owners</span>
                        <p>Equipment owners list their fleet (Excavators, Cranes, Generators, etc.) on the platform. They upload photos, technical specifications, maintenance records, and set their rental rates (daily, weekly, or monthly).</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 block">For Renters</span>
                        <p>Contractors or project managers search the "Live Map" for machinery near their job site. They can filter by machine capacity, brand, or price.</p>
                    </div>
                </div>
            )
        },
        {
            number: 2,
            title: "2. Digital Booking & Verification",
            icon: "verified_user",
            description: (
                <div className="space-y-4">
                    <p><strong>Request:</strong> The Renter selects a machine and dates. They specify if they need a "Dry Hire" (machine only) or "Wet Hire" (machine + certified operator).</p>
                    <p><strong>Verification:</strong> Heavy Hub’s system (often integrated with Nafath/Absher) verifies the identity of both parties. For specialized equipment, the platform may verify the Renter’s insurance or the Operator’s Saudi crane/heavy equipment license.</p>
                </div>
            )
        },
        {
            number: 3,
            title: "3. Smart Contracts & Secure Payment",
            icon: "payments",
            description: (
                <div className="space-y-4">
                    <p><strong>Contract Generation:</strong> Once the Owner accepts, the platform auto-generates a Digital Rental Agreement compliant with Saudi law and ZATCA regulations.</p>
                    <p><strong>Escrow Payment:</strong> The Renter pays via secure gateways (STC Pay, Moyasar). Heavy Hub holds the funds in Escrow. The Owner only receives payment after the machine is successfully delivered and confirmed on-site.</p>
                    <p><strong>Security Deposit:</strong> A digital "hold" is placed on the Renter's card to cover potential minor damages or late return fees.</p>
                </div>
            )
        },
        {
            number: 4,
            title: "4. Logistics & Digital Handover",
            icon: "local_shipping",
            description: (
                <div className="space-y-4">
                    <p><strong>Transport:</strong> Heavy Hub coordinates with 3PL logistics providers to move the equipment via low-bed trailers to the site.</p>
                    <p><strong>Inspection App:</strong> Upon delivery, the Renter and Owner use the Heavy Hub Mobile App to complete a digital checklist. They take photos of the fuel level, hour meter, and existing body condition to prevent future disputes.</p>
                </div>
            )
        },
        {
            number: 5,
            title: "5. Monitoring & Maintenance",
            icon: "monitoring",
            description: (
                <div className="space-y-4">
                    <p><strong>Telematics (IoT):</strong> During the rental, the platform tracks the machine’s location and usage hours via GPS. If a machine exceeds the agreed "8 hours per day," the system automatically calculates the overtime fee.</p>
                    <p><strong>Support:</strong> If a breakdown occurs, the Renter reports it through the app, and Heavy Hub facilitates the dispatch of a maintenance team or a replacement unit.</p>
                </div>
            )
        },
        {
            number: 6,
            title: "6. Return & Settlement",
            icon: "handshake",
            description: (
                <div className="space-y-4">
                    <p><strong>Off-Hire:</strong> Once the project is done, the Renter clicks "Off-Hire." A final inspection is performed.</p>
                    <p><strong>Release of Funds:</strong> If the machine is returned in good condition, the security deposit is released, and the final rental fee (minus Heavy Hub’s platform commission) is transferred to the Owner’s wallet.</p>
                    <p><strong>Rating:</strong> Both parties rate each other to build a "Trust Score" within the KSA construction community.</p>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-medium group"
                >
                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                    {t('home')}
                </button>

                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        How <span className="text-primary italic">Heavy Hub</span> Works
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        We streamline the end-to-end heavy equipment rental experience in Saudi Arabia, from discovery to secure settlement.
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-[32px] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    {steps.map((step, idx) => (
                        <Step
                            key={idx}
                            number={step.number}
                            title={step.title}
                            description={step.description}
                            icon={step.icon}
                            isLast={idx === steps.length - 1}
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm mb-6">Ready to get started?</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={onCreateListing}
                            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
                        >
                            List Equipment
                        </button>
                        <button
                            onClick={onBrowseMachinery}
                            className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            Browse Machinery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksScreen;
