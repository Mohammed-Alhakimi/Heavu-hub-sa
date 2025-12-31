
/**
 * Formats a number as a currency string.
 * Defaults to SAR (Saudi Riyal) with 0 fraction digits.
 * 
 * @param amount The numerical amount to format
 * @param locale The locale string (e.g. 'en', 'ar')
 * @returns The formatted currency string
 */
export const formatCurrency = (amount: number, locale: string = 'en') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
