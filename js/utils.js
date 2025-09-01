// Utility Functions

// Define formatters
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const LARGE_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
})

// Define app config
const APP_CONFIG = {
  ANIMATION_DURATION: 300,
}

/**
 * Format currency value
 * @param {number} value - The value to format
 * @param {boolean} compact - Whether to use compact notation
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, compact = false) {
  if (value === null || value === undefined || isNaN(value)) {
    return "N/A"
  }

  const formatter = compact ? LARGE_NUMBER_FORMATTER : CURRENCY_FORMATTER
  return formatter.format(value)
}

/**
 * Format percentage change
 * @param {number} change - The percentage change
 * @returns {string} Formatted percentage string
 */
function formatPercentage(change) {
  if (change === null || change === undefined || isNaN(change)) {
    return "N/A"
  }

  const formatted = Math.abs(change).toFixed(2)
  const sign = change >= 0 ? "+" : "-"
  return `${sign}${formatted}%`
}

/**
 * Get arrow icon for price change
 * @param {number} change - The price change
 * @returns {string} HTML string for arrow icon
 */
function getChangeArrow(change) {
  if (change > 0) {
    return '<i class="fas fa-arrow-up"></i>'
  } else if (change < 0) {
    return '<i class="fas fa-arrow-down"></i>'
  }
  return '<i class="fas fa-minus"></i>'
}

/**
 * Get CSS class for price change
 * @param {number} change - The price change
 * @returns {string} CSS class name
 */
function getChangeClass(change) {
  if (change > 0) return "positive"
  if (change < 0) return "negative"
  return ""
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Show loading state
 * @param {boolean} show - Whether to show loading
 */
function toggleLoading(show) {
  const spinner = document.getElementById("loadingSpinner")
  const table = document.querySelector(".table-container")

  if (show) {
    spinner.style.display = "flex"
    table.style.display = "none"
  } else {
    spinner.style.display = "none"
    table.style.display = "block"
  }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorElement = document.getElementById("errorMessage")
  const table = document.querySelector(".table-container")
  const spinner = document.getElementById("loadingSpinner")

  errorElement.querySelector("p").textContent = message
  errorElement.style.display = "flex"
  table.style.display = "none"
  spinner.style.display = "none"
}

/**
 * Hide error message
 */
function hideError() {
  const errorElement = document.getElementById("errorMessage")
  errorElement.style.display = "none"
}

/**
 * Animate element
 * @param {HTMLElement} element - Element to animate
 * @param {string} animation - Animation class name
 */
function animateElement(element, animation = "fade-in") {
  element.classList.add(animation)
  setTimeout(() => {
    element.classList.remove(animation)
  }, APP_CONFIG.ANIMATION_DURATION)
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, length = 20) {
  if (text.length <= length) return text
  return text.substring(0, length) + "..."
}

/**
 * Generate random color for charts
 * @returns {string} RGB color string
 */
function generateRandomColor() {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}

// Export functions to global scope
window.formatCurrency = formatCurrency
window.formatPercentage = formatPercentage
window.getChangeArrow = getChangeArrow
window.getChangeClass = getChangeClass
window.debounce = debounce
window.toggleLoading = toggleLoading
window.showError = showError
window.hideError = hideError
window.animateElement = animateElement
window.truncateText = truncateText
window.generateRandomColor = generateRandomColor
