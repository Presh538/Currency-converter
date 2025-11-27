import React, { useEffect, useRef, useState } from 'react';
import { CURRENCY_DATA } from '../services/api';
import './CurrencyInput.css';

interface CurrencyInputProps {
    amount: string;
    currency: string;
    onAmountChange: (value: string) => void;
    onCurrencyChange: (currency: string) => void;
    currencies: string[];
    label: string;
    readOnly?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
    amount,
    currency,
    onAmountChange,
    onCurrencyChange,
    currencies,
    label,
    readOnly = false,
}) => {
    const [fontSize, setFontSize] = useState<number>(3.5); // Initial font size in rem
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Dynamic font size calculation
        const length = amount.length;
        if (length > 10) setFontSize(1.5);
        else if (length > 7) setFontSize(2.0);
        else if (length > 5) setFontSize(2.5);
        else setFontSize(3.5);
    }, [amount]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and one decimal point
        if (/^\d*\.?\d*$/.test(value)) {
            onAmountChange(value);
        }
    };

    const currentCurrencyData = CURRENCY_DATA[currency];
    const flagUrl = currentCurrencyData
        ? `https://flagcdn.com/w40/${currentCurrencyData.countryCode}.png`
        : '';

    return (
        <div className="currency-input-container">
            <label className="input-label">{label}</label>
            <div className="input-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    value={amount}
                    onChange={handleInputChange}
                    readOnly={readOnly}
                    className="amount-input"
                    style={{ fontSize: `${fontSize}rem` }}
                    placeholder="0"
                    inputMode="decimal"
                />
                <div className="currency-selector">
                    {flagUrl && (
                        <img
                            src={flagUrl}
                            alt={`${currency} flag`}
                            className="currency-flag"
                        />
                    )}
                    <select
                        value={currency}
                        onChange={(e) => onCurrencyChange(e.target.value)}
                        className="currency-select"
                        style={{ paddingLeft: flagUrl ? '36px' : '16px' }}
                    >
                        {currencies.map((curr) => (
                            <option key={curr} value={curr}>
                                {curr}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CurrencyInput;
