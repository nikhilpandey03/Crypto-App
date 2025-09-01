// API Configuration
const API_CONFIG = {
  BASE_URL: "https://api.coingecko.com/api/v3",
  ENDPOINTS: {
    COINS_LIST: "/coins/markets",
    GLOBAL_DATA: "/global",
    COIN_HISTORY: "/coins/{id}/market_chart",
  },
  DEFAULT_PARAMS: {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 50,
    page: 1,
    sparkline: false,
    price_change_percentage: "24h",
  },
}

// App Configuration
const APP_CONFIG = {
  REFRESH_INTERVAL: 60000, // 1 minute
  CHART_DAYS: 7, // 7 days of price history
  LOCAL_STORAGE_KEYS: {
    FAVORITES: "crypto_favorites",
    THEME: "crypto_theme",
  },
  ANIMATION_DURATION: 300,
}

// Currency formatting
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
})

const LARGE_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
})

// Make available globally
window.API_CONFIG = API_CONFIG
window.APP_CONFIG = APP_CONFIG
window.CURRENCY_FORMATTER = CURRENCY_FORMATTER
window.LARGE_NUMBER_FORMATTER = LARGE_NUMBER_FORMATTER
