// Search functionality

class SearchManager {
  constructor() {
    this.searchInput = document.getElementById("searchInput")
    this.clearButton = document.getElementById("clearSearch")
    this.allCoins = []
    this.filteredCoins = []

    this.initializeEventListeners()
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Search input with debouncing
    this.searchInput.addEventListener(
      "input",
      window.debounce((e) => {
        this.handleSearch(e.target.value)
      }, 300),
    )

    // Clear search button
    this.clearButton.addEventListener("click", () => {
      this.clearSearch()
    })

    // Enter key to focus first result
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        this.focusFirstResult()
      }
    })

    // Show/hide clear button based on input
    this.searchInput.addEventListener("input", (e) => {
      this.toggleClearButton(e.target.value.length > 0)
    })
  }

  /**
   * Handle search input
   * @param {string} query - Search query
   */
  handleSearch(query) {
    const trimmedQuery = query.trim()

    if (trimmedQuery === "") {
      this.filteredCoins = [...this.allCoins]
    } else {
      this.filteredCoins = window.cryptoAPI.searchCoins(trimmedQuery, this.allCoins)
    }

    // Update the display
    window.cryptoApp.displayCryptocurrencies(this.filteredCoins)

    // Update search results info
    this.updateSearchInfo(trimmedQuery, this.filteredCoins.length)
  }

  /**
   * Clear search input and results
   */
  clearSearch() {
    this.searchInput.value = ""
    this.filteredCoins = [...this.allCoins]
    this.toggleClearButton(false)

    // Update the display
    window.cryptoApp.displayCryptocurrencies(this.filteredCoins)
    this.updateSearchInfo("", this.allCoins.length)

    // Focus back to search input
    this.searchInput.focus()
  }

  /**
   * Toggle clear button visibility
   * @param {boolean} show - Whether to show the clear button
   */
  toggleClearButton(show) {
    if (show) {
      this.clearButton.classList.add("show")
    } else {
      this.clearButton.classList.remove("show")
    }
  }

  /**
   * Focus first search result
   */
  focusFirstResult() {
    const firstRow = document.querySelector(".crypto-table tbody tr")
    if (firstRow) {
      firstRow.scrollIntoView({ behavior: "smooth", block: "center" })
      firstRow.style.backgroundColor = "var(--bg-tertiary)"
      setTimeout(() => {
        firstRow.style.backgroundColor = ""
      }, 1000)
    }
  }

  /**
   * Update search results information
   * @param {string} query - Search query
   * @param {number} resultCount - Number of results
   */
  updateSearchInfo(query, resultCount) {
    // You can add a search info element to show results count
    const searchInfo = document.getElementById("searchInfo")
    if (searchInfo) {
      if (query) {
        searchInfo.textContent = `Found ${resultCount} result${resultCount !== 1 ? "s" : ""} for "${query}"`
        searchInfo.style.display = "block"
      } else {
        searchInfo.style.display = "none"
      }
    }
  }

  /**
   * Set all coins data for searching
   * @param {Array} coins - Array of all cryptocurrency data
   */
  setAllCoins(coins) {
    this.allCoins = [...coins]
    this.filteredCoins = [...coins]
  }

  /**
   * Get current filtered coins
   * @returns {Array} Array of filtered coins
   */
  getFilteredCoins() {
    return this.filteredCoins
  }

  /**
   * Get current search query
   * @returns {string} Current search query
   */
  getCurrentQuery() {
    return this.searchInput.value.trim()
  }

  /**
   * Set search query programmatically
   * @param {string} query - Search query to set
   */
  setSearchQuery(query) {
    this.searchInput.value = query
    this.handleSearch(query)
    this.toggleClearButton(query.length > 0)
  }

  /**
   * Add search suggestions (future enhancement)
   * @param {Array} suggestions - Array of search suggestions
   */
  showSuggestions(suggestions) {
    // Implementation for search suggestions dropdown
    // This can be added as a future enhancement
  }
}

// Create global instance
window.searchManager = new SearchManager()
