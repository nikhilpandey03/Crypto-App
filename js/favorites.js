// Enhanced Favorites functionality with localStorage and dedicated view

class FavoritesManager {
  constructor() {
    this.favorites = this.loadFavorites()
    this.currentView = "all" // 'all' or 'favorites'
    this.updateFavoritesCount()
    this.initializeEventListeners()
  }

  /**
   * Initialize event listeners for favorites functionality
   */
  initializeEventListeners() {
    // Tab navigation
    const allCoinsTab = document.getElementById("allCoinsTab")
    const favoritesTab = document.getElementById("favoritesTab")
    const favoritesViewBtn = document.getElementById("favoritesViewBtn")
    const backToAllCoinsBtn = document.getElementById("backToAllCoinsBtn")
    const clearAllFavoritesBtn = document.getElementById("clearAllFavoritesBtn")
    const refreshFavoritesBtn = document.getElementById("refreshFavoritesBtn")

    // Tab clicks
    allCoinsTab?.addEventListener("click", () => this.showAllCoinsView())
    favoritesTab?.addEventListener("click", () => this.showFavoritesView())
    favoritesViewBtn?.addEventListener("click", () => this.showFavoritesView())
    backToAllCoinsBtn?.addEventListener("click", () => this.showAllCoinsView())

    // Favorites actions
    clearAllFavoritesBtn?.addEventListener("click", () => this.confirmClearAllFavorites())
    refreshFavoritesBtn?.addEventListener("click", () => this.refreshFavorites())
  }

  /**
   * Load favorites from localStorage
   * @returns {Set} Set of favorite coin IDs
   */
  loadFavorites() {
    try {
      const stored = localStorage.getItem(window.APP_CONFIG.LOCAL_STORAGE_KEYS.FAVORITES)
      return new Set(stored ? JSON.parse(stored) : [])
    } catch (error) {
      console.error("Error loading favorites:", error)
      return new Set()
    }
  }

  /**
   * Save favorites to localStorage
   */
  saveFavorites() {
    try {
      localStorage.setItem(window.APP_CONFIG.LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify([...this.favorites]))
      this.updateFavoritesCount()
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }

  /**
   * Add coin to favorites
   * @param {string} coinId - Cryptocurrency ID
   */
  addFavorite(coinId) {
    this.favorites.add(coinId)
    this.saveFavorites()
    this.updateFavoriteButton(coinId, true)
    this.showFavoriteNotification(`Added to favorites!`, "success")

    // If we're in favorites view, refresh it
    if (this.currentView === "favorites") {
      this.refreshFavorites()
    }
  }

  /**
   * Remove coin from favorites
   * @param {string} coinId - Cryptocurrency ID
   */
  removeFavorite(coinId) {
    this.favorites.delete(coinId)
    this.saveFavorites()
    this.updateFavoriteButton(coinId, false)
    this.showFavoriteNotification(`Removed from favorites!`, "info")

    // If we're in favorites view, refresh it
    if (this.currentView === "favorites") {
      this.refreshFavorites()
    }
  }

  /**
   * Toggle favorite status
   * @param {string} coinId - Cryptocurrency ID
   */
  toggleFavorite(coinId) {
    if (this.isFavorite(coinId)) {
      this.removeFavorite(coinId)
    } else {
      this.addFavorite(coinId)
    }
  }

  /**
   * Check if coin is favorite
   * @param {string} coinId - Cryptocurrency ID
   * @returns {boolean} True if coin is favorite
   */
  isFavorite(coinId) {
    return this.favorites.has(coinId)
  }

  /**
   * Get all favorites
   * @returns {Set} Set of favorite coin IDs
   */
  getFavorites() {
    return this.favorites
  }

  /**
   * Update favorite button appearance
   * @param {string} coinId - Cryptocurrency ID
   * @param {boolean} isFavorite - Whether coin is favorite
   */
  updateFavoriteButton(coinId, isFavorite) {
    const buttons = document.querySelectorAll(`[data-coin-id="${coinId}"] .btn-favorite`)
    buttons.forEach((button) => {
      if (isFavorite) {
        button.classList.add("active")
        button.innerHTML = '<i class="fas fa-heart"></i>'
        button.title = "Remove from favorites"
      } else {
        button.classList.remove("active")
        button.innerHTML = '<i class="far fa-heart"></i>'
        button.title = "Add to favorites"
      }
    })
  }

  /**
   * Update favorites count in UI
   */
  updateFavoritesCount() {
    const count = this.favorites.size
    const countElements = [
      document.getElementById("favoritesCount"),
      document.getElementById("favoritesCountHeader"),
      document.getElementById("favoritesCountTab"),
    ]

    countElements.forEach((element) => {
      if (element) {
        element.textContent = count
      }
    })
  }

  /**
   * Initialize favorite buttons for all coins
   * @param {Array} coins - Array of cryptocurrency data
   */
  initializeFavoriteButtons(coins) {
    coins.forEach((coin) => {
      this.updateFavoriteButton(coin.id, this.isFavorite(coin.id))
    })
  }

  /**
   * Filter coins to show only favorites
   * @param {Array} coins - Array of all coins
   * @returns {Array} Array of favorite coins
   */
  filterFavorites(coins) {
    return coins.filter((coin) => this.isFavorite(coin.id))
  }

  /**
   * Show all coins view
   */
  showAllCoinsView() {
    this.currentView = "all"

    // Update tabs
    document.getElementById("allCoinsTab")?.classList.add("active")
    document.getElementById("favoritesTab")?.classList.remove("active")

    // Update views
    document.getElementById("allCoinsView")?.classList.add("active")
    document.getElementById("favoritesView")?.classList.remove("active")

    // Update search placeholder
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.placeholder = "Search cryptocurrencies..."
    }
  }

  /**
   * Show favorites view
   */
  showFavoritesView() {
    this.currentView = "favorites"

    // Update tabs
    document.getElementById("allCoinsTab")?.classList.remove("active")
    document.getElementById("favoritesTab")?.classList.add("active")

    // Update views
    document.getElementById("allCoinsView")?.classList.remove("active")
    document.getElementById("favoritesView")?.classList.add("active")

    // Update search placeholder
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.placeholder = "Search favorite cryptocurrencies..."
    }

    // Load favorites data
    this.loadFavoritesView()
  }

  /**
   * Load and display favorites view
   */
  async loadFavoritesView() {
    const emptyState = document.getElementById("emptyFavoritesState")
    const tableContainer = document.getElementById("favoritesTableContainer")

    if (this.favorites.size === 0) {
      emptyState.style.display = "block"
      tableContainer.style.display = "none"
      return
    }

    try {
      // Show loading
      window.toggleLoading(true)

      // Get all coins data
      const allCoins = await window.cryptoAPI.getCryptocurrencies(1, 250) // Get more coins to ensure we have favorites

      // Filter to show only favorites
      const favoriteCoins = this.filterFavorites(allCoins)

      if (favoriteCoins.length === 0) {
        emptyState.style.display = "block"
        tableContainer.style.display = "none"
      } else {
        emptyState.style.display = "none"
        tableContainer.style.display = "block"
        this.displayFavorites(favoriteCoins)
      }

      window.toggleLoading(false)
    } catch (error) {
      console.error("Error loading favorites:", error)
      window.showError("Failed to load favorite cryptocurrencies.")
      window.toggleLoading(false)
    }
  }

  /**
   * Display favorites in the table
   * @param {Array} favoriteCoins - Array of favorite cryptocurrency data
   */
  displayFavorites(favoriteCoins) {
    const tbody = document.getElementById("favoritesTableBody")

    tbody.innerHTML = favoriteCoins.map((coin) => this.createFavoriteCoinRow(coin)).join("")

    // Add event listeners for action buttons
    this.attachFavoriteActionListeners()
  }

  /**
   * Create HTML for a favorite cryptocurrency row
   * @param {Object} coin - Cryptocurrency data
   * @returns {string} HTML string for table row
   */
  createFavoriteCoinRow(coin) {
    const priceChange = coin.price_change_percentage_24h || 0
    const changeClass = window.getChangeClass(priceChange)
    const changeArrow = window.getChangeArrow(priceChange)

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
            <button class="btn-action btn-favorite active" 
                    title="Remove from favorites"
                    data-coin-id="${coin.id}">
              <i class="fas fa-heart"></i>
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
   * Attach event listeners to favorite action buttons
   */
  attachFavoriteActionListeners() {
    // Favorite buttons in favorites view
    document.querySelectorAll("#favoritesTableBody .btn-favorite").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        const coinId = button.dataset.coinId
        this.toggleFavorite(coinId)
      })
    })

    // Chart buttons in favorites view
    document.querySelectorAll("#favoritesTableBody .btn-chart").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        const coinId = button.dataset.coinId
        const coinName = button.dataset.coinName
        window.cryptoChart.showChart(coinId, coinName)
      })
    })
  }

  /**
   * Refresh favorites data
   */
  async refreshFavorites() {
    if (this.currentView === "favorites") {
      // Clear cache to get fresh data
      window.cryptoAPI.clearCache()
      await this.loadFavoritesView()
      this.showFavoriteNotification("Favorites refreshed!", "success")
    }
  }

  /**
   * Confirm and clear all favorites
   */
  confirmClearAllFavorites() {
    if (this.favorites.size === 0) {
      this.showFavoriteNotification("No favorites to clear!", "info")
      return
    }

    if (
      confirm(`Are you sure you want to remove all ${this.favorites.size} favorites? This action cannot be undone.`)
    ) {
      this.clearAllFavorites()
    }
  }

  /**
   * Clear all favorites
   */
  clearAllFavorites() {
    const count = this.favorites.size
    this.favorites.clear()
    this.saveFavorites()

    // Update all favorite buttons
    document.querySelectorAll(".btn-favorite").forEach((button) => {
      button.classList.remove("active")
      button.innerHTML = '<i class="far fa-heart"></i>'
      button.title = "Add to favorites"
    })

    // Show empty state if in favorites view
    if (this.currentView === "favorites") {
      this.loadFavoritesView()
    }

    this.showFavoriteNotification(`Cleared ${count} favorites!`, "info")
  }

  /**
   * Show notification for favorite actions
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('success', 'info', 'error')
   */
  showFavoriteNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `favorite-notification ${type}`
    notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check" : type === "error" ? "exclamation-triangle" : "info-circle"}"></i>
      <span>${message}</span>
    `

    // Add to page
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => notification.classList.add("show"), 100)

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  /**
   * Get current view
   * @returns {string} Current view ('all' or 'favorites')
   */
  getCurrentView() {
    return this.currentView
  }
}

// Add notification styles
const notificationStyles = `
  .favorite-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1rem 1.5rem;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 1001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .favorite-notification.show {
    transform: translateX(0);
  }

  .favorite-notification.success {
    border-color: var(--success-color);
    color: var(--success-color);
  }

  .favorite-notification.info {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .favorite-notification.error {
    border-color: var(--danger-color);
    color: var(--danger-color);
  }
`

// Add styles to head
const styleSheet = document.createElement("style")
styleSheet.textContent = notificationStyles
document.head.appendChild(styleSheet)

// Create global instance
window.favoritesManager = new FavoritesManager()
