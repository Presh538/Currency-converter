
export interface ExchangeRates {
    [key: string]: number;
}

export interface CurrencyInfo {
    code: string;
    countryCode: string; // ISO 3166-1 alpha-2 for flags
    symbol: string;
}

export const CURRENCY_DATA: { [key: string]: CurrencyInfo } = {
    USD: { code: 'USD', countryCode: 'us', symbol: '$' },
    EUR: { code: 'EUR', countryCode: 'eu', symbol: '€' },
    GBP: { code: 'GBP', countryCode: 'gb', symbol: '£' },
    JPY: { code: 'JPY', countryCode: 'jp', symbol: '¥' },
    AUD: { code: 'AUD', countryCode: 'au', symbol: 'A$' },
    CAD: { code: 'CAD', countryCode: 'ca', symbol: 'C$' },
    CHF: { code: 'CHF', countryCode: 'ch', symbol: 'Fr' },
    CNY: { code: 'CNY', countryCode: 'cn', symbol: '¥' },
    SEK: { code: 'SEK', countryCode: 'se', symbol: 'kr' },
    NZD: { code: 'NZD', countryCode: 'nz', symbol: 'NZ$' },
    // Add more as needed, defaulting to generic if missing
};

export const fetchExchangeRates = async (base: string = 'USD'): Promise<ExchangeRates> => {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
        if (!response.ok) {
            throw new Error('Failed to fetch rates');
        }
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error("Error fetching rates:", error);
        // Fallback mock data if API fails
        return {
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.0,
            AUD: 1.35,
            CAD: 1.25,
            CHF: 0.92,
            CNY: 6.45,
            SEK: 8.6,
            NZD: 1.42
        };
    }
};
