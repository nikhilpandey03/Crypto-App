// Main application logic

class CryptoApp {
  constructor() {
    this.coins = []
    this.refreshInterval = null
    this.isLoading = false

    this.initializeApp()
  }

  /**
   * Initialize the application
   */
  async initializeApp() {
    try {
      // Show loading state
      window.toggleLoading(true)
      window.hideError()

      // Load initial data
      await this.loadData()

      // Initialize event listeners
      this.initializeEventListeners()

      // Start auto-refresh
      this.startAutoRefresh()

      console.log("Crypto Price Tracker initialized successfully")
    } catch (error) {
      console.error("Failed to initialize app:", error)
      window.showError("Failed to load cryptocurrency data. Please refresh the page.")
    }
  }

  /**
   * Load cryptocurrency and global data
   */
  async loadData() {
    try {
      this.isLoading = true

      // Load cryptocurrencies and global data in parallel
      const [coinsData, globalData] = await Promise.all([
        window.cryptoAPI.getCryptocurrencies(),
        window.cryptoAPI
          .getGlobalData()
          .catch(() => null), // Don't fail if global data fails
      ])

      this.coins = coinsData

      // Update UI based on current view
      if (window.favoritesManager.getCurrentView() === "favorites") {
        // If in favorites view, refresh favorites
        await window.favoritesManager.loadFavoritesView()
      } else {
        // Otherwise show all coins
        this.displayCryptocurrencies(this.coins)
      }

      this.updateGlobalStats(globalData)

      // Initialize search with all coins
      window.searchManager.setAllCoins(this.coins)

      // Initialize favorites
      window.favoritesManager.initializeFavoriteButtons(this.coins)

      window.toggleLoading(false)
    } catch (error) {
      console.error("Error loading data:", error)
      window.showError("Failed to load data. Please try again.")
      window.toggleLoading(false)
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Display cryptocurrencies in the table
   * @param {Array} coins - Array of cryptocurrency data
   */
  displayCryptocurrencies(coins) {
    const tbody = document.getElementById("cryptoTableBody")

    if (!coins || coins.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        No cryptocurrencies found
                    </td>
                </tr>
            `
      return
    }

    tbody.innerHTML = coins.map((coin) => this.createCoinRow(coin)).join("")

    // Add event listeners for action buttons
    this.attachActionListeners()

    // Animate table rows
    const rows = tbody.querySelectorAll("tr")
    rows.forEach((row, index) => {
      setTimeout(() => {
        window.animateElement(row)
      }, index * 50)
    })
  }

  /**
   * Create HTML for a cryptocurrency row
   * @param {Object} coin - Cryptocurrency data
   * @returns {string} HTML string for table row
   */
  createCoinRow(coin) {
    const priceChange = coin.price_change_percentage_24h || 0
    const changeClass = window.getChangeClass(priceChange)
    const changeArrow = window.getChangeArrow(priceChange)
    const isFavorite = window.favoritesManager.isFavorite(coin.id)

    return `
            <tr data-coin-id="${coin.id}">
                <td>${coin.market_cap_rank || "N/A"}</td>
                <td>
                    <div class="crypto-info">
                        <img src="${coin.image}" alt="${coin.name}" class="crypto-logo" loading="lazy">
                        <div>
                            <div class="crypto-name">${window.truncateText(coin.name, 15)}</div>
                        </div>
                    </div>
                </td>
                <td><span class="crypto-symbol">${coin.symbol.toUpperCase()}</span></td>
                <td>${window.formatCurrency(coin.current_price)}</td>
                <td>
                    <span class="price-change ${changeClass}">
                        ${changeArrow}
                        ${window.formatPercentage(priceChange)}
                    </span>
                </td>
                <td>${window.formatCurrency(coin.market_cap, true)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-favorite ${isFavorite ? "active" : ""}" 
                                title="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
                                data-coin-id="${coin.id}">
                            <i class="${isFavorite ? "fas" : "far"} fa-heart"></i>
                        </button>
                        <button class="btn-action btn-chart chart" 
                                title="View price chart"
                                data-coin-id="${coin.id}"
                                data-coin-name="${coin.name}">
                            <i class="fas fa-chart-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `
  }

  /**
   * Attach event listeners to action buttons
   */
  attachActionListeners() {
    // Favorite buttons
    document.querySelectorAll("#cryptoTableBody .btn-favorite").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        const coinId = button.dataset.coinId
        window.favoritesManager.toggleFavorite(coinId)
      })
    })

    // Chart buttons
    document.querySelectorAll("#cryptoTableBody .btn-chart").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        const coinId = button.dataset.coinId
        const coinName = button.dataset.coinName
        window.cryptoChart.showChart(coinId, coinName)
      })
    })
  }

  /**
   * Update global statistics
   * @param {Object} globalData - Global market data
   */
  updateGlobalStats(globalData) {
    const totalMarketCapElement = document.getElementById("totalMarketCap")
    const totalCoinsElement = document.getElementById("totalCoins")

    if (globalData && globalData.data) {
      const data = globalData.data
      totalMarketCapElement.textContent = window.formatCurrency(data.total_market_cap?.usd, true)
      totalCoinsElement.textContent = data.active_cryptocurrencies?.toLocaleString() || "N/A"
    } else {
      totalMarketCapElement.textContent = "N/A"
      totalCoinsElement.textContent = "N/A"
    }
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById("refreshBtn")
    refreshBtn.addEventListener("click", () => {
      this.refreshData()
    })

    // Handle visibility change to pause/resume auto-refresh
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stopAutoRefresh()
      } else {
        this.startAutoRefresh()
        // Refresh data when tab becomes visible again
        this.refreshData()
      }
    })
  }

  /**
   * Refresh data manually
   */
  async refreshData() {
    if (this.isLoading) return

    try {
      // Clear cache to get fresh data
      window.cryptoAPI.clearCache()

      // Show loading state on refresh button
      const refreshBtn = document.getElementById("refreshBtn")
      const originalContent = refreshBtn.innerHTML
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...'
      refreshBtn.disabled = true

      await this.loadData()

      // Restore refresh button
      refreshBtn.innerHTML = originalContent
      refreshBtn.disabled = false

      // Show success feedback
      this.showRefreshFeedback()
    } catch (error) {
      console.error("Error refreshing data:", error)
      window.showError("Failed to refresh data. Please try again.")
    }
  }

  /**
   * Show refresh feedback
   */
  showRefreshFeedback() {
    const refreshBtn = document.getElementById("refreshBtn")
    const originalContent = refreshBtn.innerHTML

    refreshBtn.innerHTML = '<i class="fas fa-check"></i> Updated'
    refreshBtn.style.color = "var(--success-color)"

    setTimeout(() => {
      refreshBtn.innerHTML = originalContent
      refreshBtn.style.color = ""
    }, 2000)
  }

  /**
   * Start auto-refresh interval
   */
  startAutoRefresh() {
    this.stopAutoRefresh() // Clear any existing interval

    this.refreshInterval = setInterval(() => {
      if (!document.hidden && !this.isLoading) {
        this.loadData()
      }
    }, window.APP_CONFIG.REFRESH_INTERVAL)
  }

  /**
   * Stop auto-refresh interval
   */
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
  }

  /**
   * Get current coins data
   * @returns {Array} Current coins array
   */
  getCoins() {
    return this.coins
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.stopAutoRefresh()
    window.cryptoAPI.clearCache()
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cryptoApp = new CryptoApp()
})

// Handle page unload
window.addEventListener("beforeunload", () => {
  if (window.cryptoApp) {
    window.cryptoApp.destroy()
  }
})

// Export for global access
window.CryptoApp = CryptoApp
