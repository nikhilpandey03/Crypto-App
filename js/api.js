// API Service for CoinGecko

// Import API_CONFIG or define it
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
    sparkline: false,
  },
}

class CryptoAPI {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Make API request with error handling
   * @param {string} url - API endpoint URL
   * @returns {Promise} API response
   */
  async makeRequest(url) {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  /**
   * Get cached data if available and not expired
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null
   */
  getCachedData(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    return null
  }

  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Fetch cryptocurrency market data
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @returns {Promise<Array>} Array of cryptocurrency data
   */
  async getCryptocurrencies(page = 1, perPage = 50) {
    const cacheKey = `coins_${page}_${perPage}`
    const cached = this.getCachedData(cacheKey)

    if (cached) {
      return cached
    }

    const params = new URLSearchParams({
      ...API_CONFIG.DEFAULT_PARAMS,
      page: page.toString(),
      per_page: perPage.toString(),
    })

    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.COINS_LIST}?${params}`
    const data = await this.makeRequest(url)

    this.setCachedData(cacheKey, data)
    return data
  }

  /**
   * Fetch global cryptocurrency market data
   * @returns {Promise<Object>} Global market data
   */
  async getGlobalData() {
    const cacheKey = "global_data"
    const cached = this.getCachedData(cacheKey)

    if (cached) {
      return cached
    }

    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.GLOBAL_DATA}`
    const data = await this.makeRequest(url)

    this.setCachedData(cacheKey, data)
    return data
  }

  /**
   * Fetch price history for a specific cryptocurrency
   * @param {string} coinId - Cryptocurrency ID
   * @param {number} days - Number of days of history
   * @returns {Promise<Object>} Price history data
   */
  async getCoinHistory(coinId, days = 7) {
    const cacheKey = `history_${coinId}_${days}`
    const cached = this.getCachedData(cacheKey)

    if (cached) {
      return cached
    }

    const params = new URLSearchParams({
      vs_currency: "usd",
      days: days.toString(),
      interval: days <= 1 ? "hourly" : "daily",
    })

    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.COIN_HISTORY.replace("{id}", coinId)}?${params}`
    const data = await this.makeRequest(url)

    this.setCachedData(cacheKey, data)
    return data
  }

  /**
   * Search cryptocurrencies by name or symbol
   * @param {string} query - Search query
   * @param {Array} allCoins - Array of all coins to search through
   * @returns {Array} Filtered coins
   */
  searchCoins(query, allCoins) {
    if (!query || query.trim() === "") {
      return allCoins
    }

    const searchTerm = query.toLowerCase().trim()
    return allCoins.filter(
      (coin) => coin.name.toLowerCase().includes(searchTerm) || coin.symbol.toLowerCase().includes(searchTerm),
    )
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear()
  }
}

// Create global instance
window.cryptoAPI = new CryptoAPI()
