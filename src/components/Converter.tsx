import React, { useEffect, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import { fetchCoinGeckoRates, calculateRates, INITIAL_CURRENCY_DATA, type ExchangeRates, type CurrencyInfo } from '../services/api';
import './Converter.css';

const Converter: React.FC = () => {
    const [amount1, setAmount1] = useState<string>('0');
    const [amount2, setAmount2] = useState<string>('');
    const [currency1, setCurrency1] = useState<string>('USD');
    const [currency2, setCurrency2] = useState<string>('EUR');
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
        // Reverse calculation
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
        // amount2 will update automatically via useEffect, but for immediate UI feedback we might want to set it too, 
        // however the useEffect dependency on currency1 change will trigger a re-fetch which might be slightly delayed.
        // Ideally we re-calculate immediately based on known rates if possible, but base currency change requires new rates usually.
        // For this simple version, let's just swap and let the effect handle it.
    };

    if (loading) return <div className="loading">Loading rates...</div>;

    return (
        <div className="converter-card">
            <h2 className="converter-title">Currency Converter</h2>
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
                    <ArrowUpDown size={16} />
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
                readOnly={false} // Allow editing both sides
            />

            <div className="rate-info">
                1 {currency1} = {rates[currency2]} {currency2}
            </div>

            <button className="action-button">Connect Wallet</button>
        </div>
    );
};

export default Converter;
