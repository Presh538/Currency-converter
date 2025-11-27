# Currency Converter - Framer Component

A beautiful, real-time currency converter component for Framer websites.

## Features

- 🌍 Real-time exchange rates from CoinGecko API
- 💱 Support for 70+ fiat and cryptocurrencies
- 🔍 Searchable dropdown with flags
- 🎨 Customizable colors and text
- 📱 Fully responsive design

## Installation for Framer

### Method 1: NPM Package (Recommended)

1. In your Framer project, go to the **Assets** panel
2. Click **Code** → **New from NPM**
3. Enter package name: `@your-username/currency-converter-framer`
4. Import the component in your canvas

### Method 2: Copy Files

1. Download the component files:
   - `FramerCurrencyConverter.tsx`
   - `CurrencyConverter.tsx`
   - `components/` folder
   - `services/` folder
   - All CSS files

2. In Framer, go to **Assets** → **Code** → **New File**
3. Copy and paste each file
4. The component will appear in your component library

## Usage in Framer

1. Drag the **Currency Converter** component onto your canvas
2. Customize using the property controls panel:
   - **From Currency**: Default source currency (e.g., "USD")
   - **To Currency**: Default target currency (e.g., "EUR")
   - **Show Title**: Toggle title visibility
   - **Title**: Custom title text
   - **Button Text**: Customize action button text
   - **Accent Color**: Primary color for buttons
   - **Background**: Background color

## Customization Options

### Property Controls

```typescript
{
  defaultFromCurrency: "USD",    // Starting currency
  defaultToCurrency: "EUR",      // Target currency
  showTitle: true,               // Show/hide title
  title: "Currency Converter",   // Title text
  buttonText: "Connect Wallet",  // Button text
  accentColor: "#6d28d9",       // Purple accent
  backgroundColor: "#0f172a"     // Dark background
}
```

## Supported Currencies

The component supports 70+ currencies including:
- **Fiat**: USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, and more
- **Crypto**: BTC, ETH, BNB, SOL, XRP, and more

## API

The component uses the free CoinGecko API for real-time rates. No API key required.

## Styling

The component uses CSS modules and can be customized via:
- Property controls (colors, text)
- CSS variables (advanced)
- Custom CSS overrides

## Example Integration

```tsx
<CurrencyConverter
  defaultFromCurrency="BTC"
  defaultToCurrency="USD"
  showTitle={true}
  title="Crypto Converter"
  buttonText="Get Started"
  accentColor="#8b5cf6"
  backgroundColor="#1e1b4b"
/>
```

## Support

For issues or questions:
- GitHub: [Your Repo URL]
- Email: your@email.com

## License

MIT License - feel free to use in your Framer projects!
