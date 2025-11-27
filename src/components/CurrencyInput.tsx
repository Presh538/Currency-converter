import React, { useEffect, useRef, useState } from 'react';
import type { CurrencyInfo } from '../services/api';
import './CurrencyInput.css';

interface CurrencyInputProps {
    amount: string;
    currency: string;
    onAmountChange: (value: string) => void;
    onCurrencyChange: (currency: string) => void;
    currencies: string[];
    currencyData: { [key: string]: CurrencyInfo };
    label: string;
    readOnly?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
    amount,
    currency,
    onAmountChange,
    onCurrencyChange,
    currencies,
    currencyData,
    label,
    readOnly = false,
}) => {
    const [fontSize, setFontSize] = useState<number>(3.5);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const length = amount.length;
        if (length > 10) setFontSize(1.5);
        else if (length > 7) setFontSize(2.0);
        else if (length > 5) setFontSize(2.5);
        else setFontSize(3.5);
    }, [amount]);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            onAmountChange(value);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setSearchQuery(''); // Reset search on open
    };

    const handleSelectCurrency = (code: string) => {
        onCurrencyChange(code);
        setIsOpen(false);
    };

    const filteredCurrencies = currencies.filter(code => {
        const data = currencyData[code];
        const searchLower = searchQuery.toLowerCase();
        return (
            code.toLowerCase().includes(searchLower) ||
            (data && data.name.toLowerCase().includes(searchLower))
        );
    });

    const getIconUrl = (code: string, data: CurrencyInfo) => {
        if (!data) return '';
        if (data.type === 'crypto') {
            return `https://assets.coincap.io/assets/icons/${code.toLowerCase()}@2x.png`;
        }
        if (data.countryCode) {
            return `https://flagcdn.com/w40/${data.countryCode}.png`;
        }
        return '';
    };

    const currentCurrencyData = currencyData[currency];
    const flagUrl = currentCurrencyData ? getIconUrl(currency, currentCurrencyData) : '';

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

                <div className="custom-dropdown" ref={dropdownRef}>
                    <div className="dropdown-trigger" onClick={toggleDropdown}>
                        {flagUrl && (
                            <img
                                src={flagUrl}
                                alt={`${currency} flag`}
                                className="trigger-flag"
                            />
                        )}
                        <span className="trigger-code">{currency}</span>
                        <span className="trigger-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="12" height="12" fill="currentColor">
                                <path d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z" />
                            </svg>
                        </span>
                    </div>

                    {isOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-search">
                                <input
                                    type="text"
                                    placeholder="Search currency..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="dropdown-list">
                                {filteredCurrencies.map((code) => {
                                    const data = currencyData[code];
                                    const itemFlagUrl = data ? getIconUrl(code, data) : '';
                                    return (
                                        <div
                                            key={code}
                                            className={`dropdown-item ${code === currency ? 'selected' : ''}`}
                                            onClick={() => handleSelectCurrency(code)}
                                        >
                                            {itemFlagUrl && (
                                                <img
                                                    src={itemFlagUrl}
                                                    alt={`${code} flag`}
                                                    className="item-flag"
                                                />
                                            )}
                                            <div className="item-info">
                                                <span className="item-code">{code}</span>
                                                <span className="item-name">{data?.name || code}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredCurrencies.length === 0 && (
                                    <div className="no-results">No currencies found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CurrencyInput;
