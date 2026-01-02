
import React, { useState } from 'react';
import { EquipmentListing } from '../types';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/currency';

interface DetailScreenProps {
  listing: EquipmentListing;
  onBack: () => void;
  isAuthenticated?: boolean;
  onRestrictedAction?: () => void;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ listing, onBack, isAuthenticated = false, onRestrictedAction = () => { } }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('machine_specs');
  const [intent, setIntent] = useState<'rent' | 'buy'>(listing.forRent ? 'rent' : 'buy');
  const [mainImage, setMainImage] = useState(listing.images[0]);

  // Update active tab when language changes if needed, or just rely on keys if possible. 
  // Simplified for now: we will just use keys for rendering.
  const tabs = ['machine_specs', 'condition_report', 'logistics_shipping'];

  return (
    <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 pb-6 items-center">
        <button
          onClick={onBack}
          className="text-[#4e7397] text-sm font-medium leading-normal hover:underline"
        >
          {t('home')}
        </button>
        <span className="text-[#4e7397] text-sm font-medium leading-normal">/</span>
        <button className="text-[#4e7397] text-sm font-medium leading-normal hover:underline">{listing.category}s</button>
        <span className="text-[#4e7397] text-sm font-medium leading-normal">/</span>
        <span className="text-slate-900 dark:text-white text-sm font-medium leading-normal">{listing.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery and Details */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Gallery Section */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 group shadow-lg">
              <img
                src={mainImage}
                alt={listing.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">360</span>
                  3D Tour
                </button>
                <button className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  Watch Video
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary ring-2 ring-primary/20 scale-95' : 'border-transparent hover:opacity-80'}`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-medium cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                +8 More
              </div>
            </div>
          </div>

          {/* Title & Badges */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {listing.isReadyToWork && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Ready-to-Work
                    </span>
                  )}
                  {listing.isVerifiedDealer && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Verified Dealer
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{listing.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  {listing.location} • SN: {listing.serialNumber}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center size-10 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-xl">share</span>
                </button>
                <button
                  onClick={() => !isAuthenticated && onRestrictedAction()}
                  className="flex items-center justify-center size-10 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">favorite</span>
                </button>
              </div>
            </div>
          </div>

          {/* Info Tabs */}
          <div className="flex flex-col gap-6">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="-mb-px flex space-x-8">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${activeTab === tab
                      ? 'border-primary text-primary border-b-2'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:text-slate-700'
                      } whitespace-nowrap py-4 px-1 text-sm font-semibold transition-all`}
                  >
                    {t(tab)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Specs Content */}
            {activeTab === 'machine_specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 animate-fadeIn">
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">timer</span> {t('hours')}
                  </span>
                  <span className="font-semibold">{listing.hours ? `${listing.hours.toLocaleString()} hrs` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">calendar_month</span> {t('year')}
                  </span>
                  <span className="font-semibold">{listing.year}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">weight</span> {t('operating_weight')}
                  </span>
                  <span className="font-semibold">{listing.weight || '48,281 lbs'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">speed</span> {t('net_power')}
                  </span>
                  <span className="font-semibold">{listing.netPower || '146 hp'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">straighten</span> {t('max_dig_depth')}
                  </span>
                  <span className="font-semibold">{listing.maxDigDepth || '22.1 ft'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">settings</span> {t('engine_model')}
                  </span>
                  <span className="font-semibold">{listing.engineModel || 'Cat C4.4 ACERT'}</span>
                </div>
              </div>
            )}


            <div className="mt-4">
              <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-lg">download</span> Download Full Spec Sheet
              </button>
            </div>
          </div>

          {/* Logistics Estimator Preview */}
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_shipping</span> Logistics Estimator
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full">
                <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVVVY7LXiDk2f16p1R7nUC_I2oGpjKSEkCqER6Q7jNhbrY1Lfx8tuoL0Llz1nfobuII19jy2TTasrXArrm7wD-MCKPaMzFSzMlUN2m8Ysa-fRxUgVBsBDFmeKu6g18gFSelGGRgREGlya_HpE48Whr0sLJto4M29Z_ziptjwzuYEsC8_kDBrfD_QDX6GqfmOWPYmtBQp0rwJndQkjrfqfuK33JphA2KdeCGkzW-KMAkCEA2KDY1LgFvPuHR68AbQGRAZ-Sskhs4vqG" className="w-full h-full object-cover opacity-60 grayscale dark:invert dark:opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white/90 dark:bg-black/70 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-slate-200 dark:border-slate-700">Origin: {listing.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full flex flex-col gap-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Delivery Zip Code</label>
                <div className="flex gap-2">
                  <input className="form-input flex-1 rounded-lg border-slate-300 dark:border-slate-600 bg-transparent text-sm focus:ring-primary focus:border-primary outline-none" placeholder="e.g. 75001" type="text" />
                  <button className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Calculate</button>
                </div>
                <p className="text-xs text-slate-500">Estimates are provided by trusted haulers. Final price may vary.</p>
              </div>
            </div>
          </div>

          {/* Seller Profile */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
            <h3 className="text-lg font-bold mb-4">About the Seller</h3>
            <div className="flex items-start gap-4">
              {listing?.seller && (
                <div className="size-16 rounded-full bg-slate-200 overflow-hidden shrink-0 border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                  <img
                    src={listing.seller.avatar}
                    alt={listing.seller.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{listing.seller.name}</span>
                  <span className="material-symbols-outlined text-blue-500 text-[18px]" title="Verified Dealer">verified</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-yellow-500 my-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`material-symbols-outlined text-[16px] ${i < Math.floor(listing.seller.rating) ? 'fill-current' : ''}`}>
                      {i < Math.floor(listing.seller.rating) ? 'star' : (i < listing.seller.rating ? 'star_half' : 'star')}
                    </span>
                  ))}
                  <span className="text-slate-500 dark:text-slate-400 ml-2 text-xs font-medium">({listing.seller.reviewsCount} reviews)</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  {listing.seller.description}
                </p>
                <button className="mt-3 text-primary text-sm font-bold self-start hover:underline">View Dealer Profile</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Sidebar */}
        <div className="lg:col-span-4 relative h-full">
          <div className="sticky top-24 flex flex-col gap-4">
            {/* Rent Card */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
              <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-900 p-1.5 gap-1.5 m-2.5 rounded-xl">
                <button
                  onClick={() => setIntent('rent')}
                  className={`py-2 text-center rounded-lg text-sm font-bold transition-all ${intent === 'rent' ? 'bg-white dark:bg-surface-dark text-primary shadow-md' : 'text-slate-500'}`}
                >
                  {t('rent')}
                </button>
                <button
                  onClick={() => setIntent('buy')}
                  className={`py-2 text-center rounded-lg text-sm font-bold transition-all ${intent === 'buy' ? 'bg-white dark:bg-surface-dark text-primary shadow-md' : 'text-slate-500'}`}
                >
                  {t('buy')}
                </button>
              </div>

              {intent === 'rent' ? (
                <div className="p-6 pt-2 flex flex-col gap-6 animate-fadeIn">
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="flex flex-col p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest">{t('daily')}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(listing.rentDaily, i18n.language)}</span>
                    </div>
                    <div className="flex flex-col p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest">{t('weekly')}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(listing.rentWeekly, i18n.language)}</span>
                    </div>
                    <div className="flex flex-col p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest">{t('monthly')}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(listing.rentMonthly, i18n.language)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('start_date')}</label>
                        <input className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-transparent text-sm py-2 pl-3 focus:ring-primary focus:border-primary outline-none" type="date" defaultValue="2023-10-15" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('end_date')}</label>
                        <input className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-transparent text-sm py-2 pl-3 focus:ring-primary focus:border-primary outline-none" type="date" defaultValue="2023-10-22" />
                      </div>
                    </div>

                    {/* Calendar visualizer placeholder */}
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">October 2023</span>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-slate-300"></div><span className="text-[10px] text-slate-400">Past</span></div>
                          <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-red-400"></div><span className="text-[10px] text-slate-400">Blocked</span></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-slate-400 mb-1">{d}</span>)}
                        {[...Array(31)].map((_, i) => {
                          const day = i + 1;
                          let style = "py-1.5 rounded-md cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 ";
                          if (day < 5) style += "text-slate-300 ";
                          else if (day >= 5 && day <= 9) style += "bg-red-50 text-red-400 cursor-not-allowed ";
                          else if (day >= 15 && day <= 22) style += "bg-primary text-white shadow-sm ";
                          else style += "text-slate-700 dark:text-slate-200 ";
                          return <div key={i} className={style}>{day}</div>;
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">{t('estimated_total')}</span>
                      <span className="font-black text-slate-900 dark:text-white text-2xl">{formatCurrency(2150, i18n.language)}</span>
                    </div>
                    <button
                      onClick={() => !isAuthenticated && onRestrictedAction()}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
                    >
                      {t('request_booking')}
                      <span className={`material-symbols-outlined text-[20px] ${i18n.dir() === 'rtl' ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`}>arrow_forward</span>
                    </button>
                    <p className="text-center text-xs text-slate-400">{t('no_charge_yet')}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 pt-2 flex flex-col gap-6 animate-fadeIn">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-sm font-bold text-slate-500">Price to Own</span>
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-black uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[14px]">verified_user</span> Title Checked
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{formatCurrency(listing.buyPrice, i18n.language)}</span>
                    <a className="text-xs text-primary font-bold hover:underline" href="#">{t('est_financing')}</a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => !isAuthenticated && onRestrictedAction()}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:text-primary transition-all font-black py-3.5 rounded-xl"
                    >
                      Make an Offer
                    </button>
                    <button
                      onClick={() => !isAuthenticated && onRestrictedAction()}
                      className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      Message Seller
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Support info card */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-500">info</span>
              <p className="text-xs text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                {t('protection_stub')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default DetailScreen;
