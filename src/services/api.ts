
export interface ExchangeRates {
    [key: string]: number;
}

export interface CurrencyInfo {
    code: string;
    countryCode: string; // ISO 3166-1 alpha-2 for flags
    symbol: string;
    name: string;
    rateVsBTC?: number; // Added for CoinGecko calculation
    type?: 'fiat' | 'crypto' | 'commodity';
}

// Initial fallback data
export const INITIAL_CURRENCY_DATA: { [key: string]: CurrencyInfo } = {
    USD: { code: 'USD', countryCode: 'us', symbol: '$', name: 'US Dollar', type: 'fiat' },
    EUR: { code: 'EUR', countryCode: 'eu', symbol: '€', name: 'Euro', type: 'fiat' },
    GBP: { code: 'GBP', countryCode: 'gb', symbol: '£', name: 'British Pound', type: 'fiat' },
    JPY: { code: 'JPY', countryCode: 'jp', symbol: '¥', name: 'Japanese Yen', type: 'fiat' },
    BTC: { code: 'BTC', countryCode: '', symbol: '₿', name: 'Bitcoin', type: 'crypto' },
    ETH: { code: 'ETH', countryCode: '', symbol: 'Ξ', name: 'Ethereum', type: 'crypto' },
};

interface CoinGeckoRate {
    name: string;
    unit: string;
    value: number;
    type: 'fiat' | 'crypto' | 'commodity';
}

interface CoinGeckoResponse {
    rates: { [key: string]: CoinGeckoRate };
}

export const fetchCoinGeckoRates = async (): Promise<{ [key: string]: CurrencyInfo }> => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
        if (!response.ok) {
            throw new Error('Failed to fetch rates');
        }
        const data: CoinGeckoResponse = await response.json();

        const normalizedData: { [key: string]: CurrencyInfo } = {};

        Object.entries(data.rates).forEach(([key, value]) => {
            const code = key.toUpperCase();
            // Map common country codes for flags
            let countryCode = '';
            if (value.type === 'fiat') {
                // Simple heuristic: first 2 letters often match country code (e.g. US, GB, AU)
                // But not always (EUR -> eu, JPY -> jp, CHF -> ch)
                // We can use a small map or just try the first 2 chars lowercased
                const map: { [key: string]: string } = {
                    USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp', AUD: 'au',
                    CAD: 'ca', CHF: 'ch', CNY: 'cn', SEK: 'se', NZD: 'nz',
                    KRW: 'kr', SGD: 'sg', INR: 'in', HKD: 'hk', BRL: 'br',
                    RUB: 'ru', ZAR: 'za', TRY: 'tr', MXN: 'mx', IDR: 'id',
                    // Add more as needed
                };
                countryCode = map[code] || code.slice(0, 2).toLowerCase();
            }

            normalizedData[code] = {
                code,
                countryCode,
                symbol: value.unit,
                name: value.name,
                rateVsBTC: value.value,
                type: value.type
            };
        });

        return normalizedData;
    } catch (error) {
        console.error("Error fetching rates:", error);
        return INITIAL_CURRENCY_DATA;
    }
};

export const calculateRates = (base: string, currencyData: { [key: string]: CurrencyInfo }): ExchangeRates => {
    const rates: ExchangeRates = {};
    const baseCurrency = currencyData[base];

    if (!baseCurrency || !baseCurrency.rateVsBTC) {
        // Fallback if base not found (shouldn't happen if data is good)
        return {};
    }

    const baseRateVsBTC = baseCurrency.rateVsBTC;

    Object.values(currencyData).forEach(currency => {
        if (currency.rateVsBTC) {
            // Rate: How many Target per 1 Base?
            // 1 Base = (1 / baseRateVsBTC) BTC
            // 1 Target = (1 / targetRateVsBTC) BTC
            // 1 Base = (1/baseRateVsBTC) * targetRateVsBTC Target
            // Example: Base USD (90k), Target EUR (80k)
            // 1 USD = (1/90k) * 80k = 80/90 = 0.88 EUR
            rates[currency.code] = currency.rateVsBTC / baseRateVsBTC;
        }
    });

    return rates;
};
