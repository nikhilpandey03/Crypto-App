// Dark mode theme functionality

class ThemeManager {
  constructor() {
    this.currentTheme = this.loadTheme()
    this.toggleButton = document.getElementById("darkModeToggle")

    this.initializeTheme()
    this.initializeEventListeners()
  }

  /**
   * Load theme from localStorage or system preference
   * @returns {string} Theme name ('light' or 'dark')
   */
  loadTheme() {
    try {
      const stored = localStorage.getItem(window.APP_CONFIG.LOCAL_STORAGE_KEYS.THEME)
      if (stored) {
        return stored
      }

      // Check system preference
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark"
      }

      return "light"
    } catch (error) {
      console.error("Error loading theme:", error)
      return "light"
    }
  }

  /**
   * Save theme to localStorage
   * @param {string} theme - Theme name
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(window.APP_CONFIG.LOCAL_STORAGE_KEYS.THEME, theme)
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  /**
   * Initialize theme on page load
   */
  initializeTheme() {
    this.applyTheme(this.currentTheme)
    this.updateToggleButton()
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Toggle button click
    this.toggleButton.addEventListener("click", () => {
      this.toggleTheme()
    })

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const stored = localStorage.getItem(window.APP_CONFIG.LOCAL_STORAGE_KEYS.THEME)
        if (!stored) {
          const newTheme = e.matches ? "dark" : "light"
          this.currentTheme = newTheme
          this.applyTheme(newTheme)
          this.updateToggleButton()
        }
      })
    }

    // Keyboard shortcut (Ctrl/Cmd + Shift + D)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault()
        this.toggleTheme()
      }
    })
  }

  /**
   * Apply theme to document
   * @param {string} theme - Theme name
   */
  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)

    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta")
      metaThemeColor.name = "theme-color"
      document.head.appendChild(metaThemeColor)
    }

    metaThemeColor.content = theme === "dark" ? "#0f172a" : "#ffffff"
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light"
    this.currentTheme = newTheme
    this.applyTheme(newTheme)
    this.saveTheme(newTheme)
    this.updateToggleButton()

    // Add transition effect
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease"
    setTimeout(() => {
      document.body.style.transition = ""
    }, 300)
  }

  /**
   * Update toggle button appearance
   */
  updateToggleButton() {
    const icon = this.toggleButton.querySelector("i")
    if (this.currentTheme === "dark") {
      icon.className = "fas fa-sun"
      this.toggleButton.title = "Switch to light mode"
    } else {
      icon.className = "fas fa-moon"
      this.toggleButton.title = "Switch to dark mode"
    }
  }

  /**
   * Get current theme
   * @returns {string} Current theme name
   */
  getCurrentTheme() {
    return this.currentTheme
  }

  /**
   * Set specific theme
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  setTheme(theme) {
    if (theme === "light" || theme === "dark") {
      this.currentTheme = theme
      this.applyTheme(theme)
      this.saveTheme(theme)
      this.updateToggleButton()
    }
  }
}

// Create global instance
window.themeManager = new ThemeManager()
