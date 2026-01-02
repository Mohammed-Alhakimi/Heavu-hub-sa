
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EquipmentListing } from '../types';
import { getListings } from '../services/listings';
import { formatCurrency } from '../utils/currency';

interface SearchScreenProps {
  onListingClick: (listing: EquipmentListing) => void;
  isAuthenticated?: boolean;
  onRestrictedAction?: () => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onListingClick, isAuthenticated = false, onRestrictedAction = () => { } }) => {
  const [intent, setIntent] = useState<'buy' | 'rent'>('buy');
  const [activeCategory, setActiveCategory] = useState<string>('Excavators');
  const { t, i18n } = useTranslation();

  const [listings, setListings] = useState<EquipmentListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const result = await getListings();
        setListings(result.listings);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        setError('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-80 lg:min-w-80 p-6 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark lg:h-[calc(100vh-65px)] lg:sticky lg:top-[65px] overflow-y-auto custom-scrollbar flex flex-col gap-8 shrink-0 transition-colors">
        <div className="flex items-center justify-between lg:hidden mb-4">
          <h3 className="font-bold text-lg">{t('filters')}</h3>
          <button className="text-primary font-medium text-sm">{t('reset')}</button>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold">{t('keywords')}</label>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary material-symbols-outlined">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              placeholder="Make, model, or keyword"
              type="text"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold">Category</label>
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none"
            >
              <option>All Categories</option>
              <option>Excavators</option>
              <option>Bulldozers</option>
              <option>Cranes</option>
              <option>Loaders</option>
              <option>Lifts</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none material-symbols-outlined">expand_more</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold">{t('location')}</label>
            <span className="text-xs text-primary cursor-pointer hover:underline">{t('use_my_location')}</span>
          </div>
          <div className="relative group mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary material-symbols-outlined">location_on</span>
            <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="City, State or Zip" type="text" />
          </div>
          <div className="px-1">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>{t('radius')}</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">50 mi</span>
            </div>
            <input className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" max="500" min="10" type="range" defaultValue="50" />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-sm font-semibold">{t('price_range')}</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">SAR</span>
              <input className="w-full pl-9 pr-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Min" type="number" />
            </div>
            <span className="text-slate-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">SAR</span>
              <input className="w-full pl-9 pr-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Max" type="number" />
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors mt-auto lg:mt-4 shadow-lg shadow-primary/20">
          {t('apply_filters')}
        </button>
      </aside>

      {/* Main Feed Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="pt-8 pb-6 px-6 lg:px-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark sticky top-[65px] z-40 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{t('find_equipment')}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">{t('browse_listings')}</p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center shadow-inner">
              <button
                onClick={() => setIntent('buy')}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${intent === 'buy' ? 'bg-white dark:bg-background-dark text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                Buy
              </button>
              <button
                onClick={() => setIntent('rent')}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${intent === 'rent' ? 'bg-white dark:bg-background-dark text-secondary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                Rent
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20 flex items-center gap-1">
                {activeCategory} <button className="hover:text-primary-dark ml-1">×</button>
              </span>
              <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {t('clear_all')}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 hidden sm:inline-block">{t('sort_by')}:</span>
              <select className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-10 min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400">Loading listings...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
              <p className="text-slate-900 dark:text-white font-medium mb-1">Oops!</p>
              <p className="text-slate-500 dark:text-slate-400">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Try Again
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">search_off</span>
              <p className="text-slate-900 dark:text-white font-medium mb-1">No listings found</p>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">We couldn't find any approved listings matching your criteria. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => onListingClick(listing)}
                  className="group bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                      {listing.forSale && <span className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">{t('for_sale')}</span>}
                      {listing.forRent && <span className="px-2.5 py-1 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">{t('for_rent')}</span>}
                      {listing.isAvailable && (
                        <span className="px-2.5 py-1 bg-success text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">bolt</span> {t('available')}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAuthenticated) {
                            onRestrictedAction();
                            return;
                          }
                          // Favorite logic here 
                        }}
                        className="bg-white/90 dark:bg-black/50 p-1.5 rounded-full text-slate-400 hover:text-red-500 transition-colors backdrop-blur-sm"
                      >
                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                      </button>
                    </div>
                    <img
                      src={listing.images[0]}
                      alt={listing.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {listing.name || listing.title}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {(listing.hours || listing.specs?.hours)
                            ? `${(listing.hours || listing.specs?.hours).toLocaleString()} hrs`
                            : listing.category}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {typeof listing.location === 'object' ? listing.location.address : listing.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">{listing.category}</span>
                    </div>

                    <div className="mt-auto space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {listing.forSale && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium text-slate-500">Buy Now</span>
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(listing.buyPrice || listing.price?.buy || 0, i18n.language)}
                          </span>
                        </div>
                      )}
                      {listing.forRent && (
                        <div className="flex justify-between items-baseline text-secondary">
                          <span className="text-sm font-medium">Rent</span>
                          <span className="text-base font-bold">
                            {formatCurrency(listing.rentDaily || listing.price?.rentDaily || 0, i18n.language)}
                            <span className="text-xs font-normal text-slate-500 ml-1">/ day</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <button className="w-full mt-4 py-2.5 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-lg text-sm font-semibold transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && listings.length > 0 && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                  <span className="material-symbols-outlined">chevron_{i18n.dir() === 'rtl' ? 'right' : 'left'}</span>
                </button>
                <button className="w-10 h-10 rounded-lg bg-primary text-white font-medium flex items-center justify-center shadow-md shadow-primary/20">1</button>
                <button className="w-10 h-10 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium flex items-center justify-center">2</button>
                <button className="w-10 h-10 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium flex items-center justify-center">3</button>
                <span className="text-slate-400 px-2">...</span>
                <button className="w-10 h-10 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium flex items-center justify-center">12</button>
                <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">chevron_{i18n.dir() === 'rtl' ? 'left' : 'right'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
