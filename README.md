# 🚀 Crypto Price Tracker

A modern, responsive cryptocurrency price tracking application built with vanilla JavaScript, HTML, and CSS. Features real-time price updates, interactive charts, dark mode, search functionality, and favorites management.

![Crypto Price Tracker](https://via.placeholder.com/800x400/2563eb/ffffff?text=Crypto+Price+Tracker)

## ✨ Features

### Core Features
- **Real-time Price Data**: Live cryptocurrency prices from CoinGecko API
- **Interactive Charts**: 7-day price history using Chart.js
- **Search Functionality**: Search cryptocurrencies by name or symbol
- **Favorites System**: Save favorite coins with localStorage
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Technical Features
- **API Caching**: Intelligent caching to reduce API calls
- **Auto-refresh**: Automatic data updates every minute
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance Optimized**: Debounced search, lazy loading, and efficient rendering
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic page structure |
| **CSS3** | Modern styling with CSS Grid/Flexbox |
| **Vanilla JavaScript** | Core functionality and API integration |
| **Chart.js** | Interactive price charts |
| **CoinGecko API** | Cryptocurrency data source |
| **Font Awesome** | Icons and visual elements |
| **LocalStorage** | Client-side data persistence |

### Usage

1. **View Cryptocurrencies**: The app loads the top 50 cryptocurrencies by market cap
2. **Search**: Use the search bar to find specific cryptocurrencies
3. **Add Favorites**: Click the heart icon to save favorite coins
4. **View Charts**: Click the chart icon to see 7-day price history
5. **Toggle Theme**: Click the moon/sun icon to switch between dark and light modes
6. **Refresh Data**: Click the refresh button or wait for auto-refresh

## 🎨 Features Deep Dive

### Real-time Data
- Fetches data from CoinGecko API every minute
- Shows current price, 24h change, and market cap
- Color-coded price changes (green for positive, red for negative)

### Interactive Charts
- 7-day price history visualization
- Responsive Chart.js implementation
- Hover tooltips with detailed information
- Modal overlay for better viewing experience

### Search & Filtering
- Real-time search with debouncing
- Search by cryptocurrency name or symbol
- Instant results with no page reload

### Favorites Management
- Add/remove favorites with one click
- Persistent storage using localStorage
- Favorites counter in the stats section

### Theme System
- Dark and light mode support
- Automatic system preference detection
- Smooth transitions between themes
- Persistent theme selection

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Horizontal scrolling for tables on mobile

## 🙏 Acknowledgments

- [CoinGecko](https://coingecko.com) for providing the free cryptocurrency API
- [Chart.js](https://chartjs.org) for the charting library
- [Font Awesome](https://fontawesome.com) for the icons
- The cryptocurrency community for inspiration
