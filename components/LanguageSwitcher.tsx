
import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'ur', name: 'اردو', dir: 'rtl' },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        const selectedLang = languages.find(l => l.code === lng);
        if (selectedLang) {
            document.dir = selectedLang.dir;
        }
    };

    return (
        <div className="flex space-x-2 rtl:space-x-reverse">
            {languages.map((lng) => (
                <button
                    key={lng.code}
                    onClick={() => changeLanguage(lng.code)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${i18n.language === lng.code
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    {lng.name}
                </button>
            ))}
        </div>
    );
}
