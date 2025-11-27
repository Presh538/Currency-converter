import React, { useEffect, useState } from 'react';
import CurrencyInput from './components/CurrencyInput';
import { fetchCoinGeckoRates, calculateRates, INITIAL_CURRENCY_DATA, type ExchangeRates, type CurrencyInfo } from './services/api';
import './components/Converter.css';

interface CurrencyConverterProps {
    defaultFromCurrency?: string;
    defaultToCurrency?: string;
    showTitle?: boolean;
    title?: string;
    buttonText?: string;
    accentColor?: string;
    backgroundColor?: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
    defaultFromCurrency = 'USD',
    defaultToCurrency = 'EUR',
    showTitle = true,
    title = 'Currency Converter',
    buttonText = 'Connect Wallet',
    accentColor = '#6d28d9',
    backgroundColor = '#0f172a',
}) => {
    const [amount1, setAmount1] = useState<string>('0');
    const [amount2, setAmount2] = useState<string>('');
    const [currency1, setCurrency1] = useState<string>(defaultFromCurrency);
    const [currency2, setCurrency2] = useState<string>(defaultToCurrency);
    const [currencyData, setCurrencyData] = useState<{ [key: string]: CurrencyInfo }>(INITIAL_CURRENCY_DATA);
    const [rates, setRates] = useState<ExchangeRates>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initData = async () => {
            const data = await fetchCoinGeckoRates();
            setCurrencyData(data);
            setLoading(false);
        };
        initData();
    }, []);

    useEffect(() => {
        if (!loading && currencyData[currency1]) {
            const newRates = calculateRates(currency1, currencyData);
            setRates(newRates);
        }
    }, [currency1, currencyData, loading]);

    useEffect(() => {
        if (rates[currency2]) {
            const rate = rates[currency2];
            const result = (parseFloat(amount1) * rate).toFixed(2);
            if (!isNaN(parseFloat(result))) {
                setAmount2(result);
            } else {
                setAmount2('');
            }
        }
    }, [amount1, currency2, rates]);

    const handleAmount1Change = (value: string) => {
        setAmount1(value);
    };

    const handleAmount2Change = (value: string) => {
        setAmount2(value);
        if (rates[currency2]) {
            const rate = rates[currency2];
            const result = (parseFloat(value) / rate).toFixed(2);
            if (!isNaN(parseFloat(result))) {
                setAmount1(result);
            } else {
                setAmount1('');
            }
        }
    };

    const handleCurrency1Change = (currency: string) => {
        setCurrency1(currency);
    };

    const handleCurrency2Change = (currency: string) => {
        setCurrency2(currency);
    };

    const handleSwap = () => {
        setCurrency1(currency2);
        setCurrency2(currency1);
        setAmount1(amount2);
    };

    if (loading) return <div className="loading">Loading rates...</div>;

    return (
        <div className="app-container" style={{ backgroundColor }}>
            <div className="converter-card">
                {showTitle && <h2 className="converter-title">{title}</h2>}

                <CurrencyInput
                    label="You pay"
                    amount={amount1}
                    currency={currency1}
                    onAmountChange={handleAmount1Change}
                    onCurrencyChange={handleCurrency1Change}
                    currencies={Object.keys(currencyData)}
                    currencyData={currencyData}
                />

                <div className="swap-container">
                    <button className="swap-button" onClick={handleSwap} aria-label="Swap currencies">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', transform: 'rotate(180deg)' }}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                    </button>
                </div>

                <CurrencyInput
                    label="You receive"
                    amount={amount2}
                    currency={currency2}
                    onAmountChange={handleAmount2Change}
                    onCurrencyChange={handleCurrency2Change}
                    currencies={Object.keys(currencyData)}
                    currencyData={currencyData}
                    readOnly={false}
                />

                <div className="rate-info">
                    1 {currency1} = {rates[currency2]} {currency2}
                </div>

                <button className="action-button" style={{ backgroundColor: accentColor }}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default CurrencyConverter;
