import { addPropertyControls, ControlType } from "framer"
import React from "react"
import CurrencyConverter from "./CurrencyConverter"

/**
 * Currency Converter Component for Framer
 * 
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function CurrencyConverterWrapper(props) {
    const {
        defaultFromCurrency,
        defaultToCurrency,
        showTitle,
        title,
        buttonText,
        accentColor,
        backgroundColor,
        width,
        height,
    } = props

    return (
        <div style={{ width, height }}>
            <CurrencyConverter
                defaultFromCurrency={defaultFromCurrency}
                defaultToCurrency={defaultToCurrency}
                showTitle={showTitle}
                title={title}
                buttonText={buttonText}
                accentColor={accentColor}
                backgroundColor={backgroundColor}
            />
        </div>
    )
}

CurrencyConverterWrapper.defaultProps = {
    defaultFromCurrency: "USD",
    defaultToCurrency: "EUR",
    showTitle: true,
    title: "Currency Converter",
    buttonText: "Connect Wallet",
    accentColor: "#6d28d9",
    backgroundColor: "#0f172a",
    width: 480,
    height: 600,
}

addPropertyControls(CurrencyConverterWrapper, {
    defaultFromCurrency: {
        type: ControlType.String,
        title: "From Currency",
        defaultValue: "USD",
        placeholder: "USD",
    },
    defaultToCurrency: {
        type: ControlType.String,
        title: "To Currency",
        defaultValue: "EUR",
        placeholder: "EUR",
    },
    showTitle: {
        type: ControlType.Boolean,
        title: "Show Title",
        defaultValue: true,
    },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Currency Converter",
        hidden: (props) => !props.showTitle,
    },
    buttonText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Connect Wallet",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#6d28d9",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#0f172a",
    },
})
