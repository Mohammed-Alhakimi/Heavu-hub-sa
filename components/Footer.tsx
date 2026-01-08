import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
    userRole?: string | null;
    onCreateListing?: () => void;
    onHowItWorksClick?: () => void;
    onAboutClick?: () => void;
    onFAQClick?: () => void;
    onPrivacyClick?: () => void;
    onTermsClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ userRole, onCreateListing, onHowItWorksClick, onAboutClick, onFAQClick, onPrivacyClick, onTermsClick }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    const canCreateListing = userRole === 'dealer' || userRole === 'admin';

    return (
        <footer className="bg-[#0B0121] text-white pt-16 pb-8 px-6 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 items-start ${isRTL ? 'text-right' : 'text-left'}`}>

                    {/* Actions Column (Left in LTR, Right in RTL based on design usually, but design has it on the extreme left) */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        {canCreateListing && (
                            <button
                                onClick={onCreateListing}
                                className="w-full bg-[#F5934C] hover:bg-[#E0823D] text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
                            >
                                <span className="material-symbols-outlined font-bold">add</span>
                                {t('footer.actions.add_product')}
                            </button>
                        )}

                        <button
                            onClick={() => window.open('https://wa.me/966549935482', '_blank')}
                            className="w-full border-2 border-[#00C853] text-[#00C853] hover:bg-[#00C853]/10 font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all group"
                        >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                            {t('footer.actions.whatsapp')}
                        </button>



                        <div className="flex justify-center mt-4">
                            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-white">arrow_upward</span>
                            </button>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h4 className="text-[#F5934C] font-bold text-lg">{t('footer.sections.my_products.title')}</h4>
                        <ul className="flex flex-col gap-3 text-sm text-slate-400 font-medium">
                            <li className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.my_products.list')}</li>
                            <li className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.my_products.requests')}</li>
                            <li className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.my_products.bookings')}</li>
                            <li className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.my_products.wishlist')}</li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h4 className="text-[#F5934C] font-bold text-lg">{t('footer.sections.about.title')}</h4>
                        <ul className="flex flex-col gap-3 text-sm text-slate-400 font-medium">
                            <li onClick={onAboutClick} className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.about.about_us')}</li>
                            <li onClick={onFAQClick} className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.about.faq')}</li>
                            <li onClick={onPrivacyClick} className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.about.privacy')}</li>
                            <li onClick={onTermsClick} className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.about.terms')}</li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h4 className="text-[#F5934C] font-bold text-lg">{t('footer.sections.rent.title')}</h4>
                        <ul className="flex flex-col gap-3 text-sm text-slate-400 font-medium">
                            <li className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.rent.browse')}</li>
                            <li
                                onClick={onHowItWorksClick}
                                className="hover:text-white transition-colors cursor-pointer"
                            >
                                {t('footer.sections.rent.how_it_works')}
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.rent.request_quote')}</li>
                            <li className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.rent.support')}</li>
                            <li className="hover:text-white transition-colors cursor-pointer">{t('footer.sections.rent.blog')}</li>
                        </ul>
                        <div className="text-sm font-bold text-[#F5934C] hover:underline cursor-pointer">{t('footer.sections.rent.coming_soon')}</div>

                        <div className="flex flex-col gap-3 mt-4">
                            <div className="flex gap-2">
                                <img src="/playstore.png" alt="Google Play" className="h-8 w-auto cursor-pointer" />
                                <img src="/appstore.png" alt="App Store" className="h-8 w-auto cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Branding Column */}
                    <div className="lg:col-span-3 flex flex-col gap-6 lg:items-end">
                        <div className="flex items-center gap-3 lg:justify-end">
                            <img src="/logo.png" alt="Heavy Hub" className="h-12 w-auto" />
                        </div>
                        <p className={`text-xs text-slate-400 font-medium leading-relaxed max-w-[300px] ${isRTL ? 'text-right' : 'text-left lg:text-right'}`}>
                            {t('footer.description')}
                        </p>

                        <div className="flex flex-col gap-4 items-center md:items-start lg:items-end">
                            <span className="text-sm font-bold text-white">{t('footer.join_us')}</span>
                            <div className="flex gap-3">
                                {['facebook', 'tiktok', 'snapchat', 'linkedin', 'twitter', 'instagram'].map(platform => (
                                    <div key={platform} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                                        <img src={`/social/${platform}.png`} alt={platform} className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="bg-[#1A0B33] rounded-xl px-4 py-2 flex items-center gap-4">
                        <img src="/payments/applepay.png" alt="Apple Pay" className="h-4 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                        <img src="/payments/visa.png" alt="Visa" className="h-4 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                        <img src="/payments/mastercard.png" alt="Mastercard" className="h-4 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                        <img src="/payments/mada.png" alt="Mada" className="h-4 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                        <img src="/payments/ebank.png" alt="EBank" className="h-4 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                        <img src="/payments/tabby.png" alt="Tabby" className="h-4 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
