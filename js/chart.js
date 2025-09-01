import { Chart } from "@/components/ui/chart"
// Chart functionality using Chart.js

class CryptoChart {
  constructor() {
    this.chart = null
    this.modal = document.getElementById("chartModal")
    this.canvas = document.getElementById("priceChart")
    this.chartTitle = document.getElementById("chartTitle")
    this.closeBtn = document.getElementById("closeModal")

    this.initializeEventListeners()
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Close modal events
    this.closeBtn.addEventListener("click", () => this.closeModal())
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal()
      }
    })

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("show")) {
        this.closeModal()
      }
    })
  }

  /**
   * Show price chart for a cryptocurrency
   * @param {string} coinId - Cryptocurrency ID
   * @param {string} coinName - Cryptocurrency name
   */
  async showChart(coinId, coinName) {
    try {
      this.openModal()
      this.chartTitle.textContent = `${coinName} Price History (7 Days)`

      // Show loading state
      this.showChartLoading()

      // Fetch price history
      const historyData = await window.cryptoAPI.getCoinHistory(coinId, window.APP_CONFIG.CHART_DAYS)

      // Create chart
      this.createChart(historyData, coinName)
    } catch (error) {
      console.error("Error loading chart:", error)
      this.showChartError()
    }
  }

  /**
   * Create Chart.js chart
   * @param {Object} historyData - Price history data
   * @param {string} coinName - Cryptocurrency name
   */
  createChart(historyData, coinName) {
    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy()
    }

    // Prepare data
    const prices = historyData.prices || []
    const labels = prices.map((price) => {
      const date = new Date(price[0])
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: prices.length <= 24 ? "numeric" : undefined,
      })
    })
    const priceData = prices.map((price) => price[1])

    // Chart configuration
    const config = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `${coinName} Price (USD)`,
            data: priceData,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#2563eb",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "#2563eb",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => `Price: ${window.formatCurrency(context.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 7,
              color: "#64748b",
            },
          },
          y: {
            display: true,
            grid: {
              color: "rgba(100, 116, 139, 0.1)",
            },
            ticks: {
              callback: (value) => window.formatCurrency(value, true),
              color: "#64748b",
            },
          },
        },
        elements: {
          point: {
            hoverRadius: 8,
          },
        },
      },
    }

    // Create chart
    this.chart = new Chart(this.canvas, config)
  }

  /**
   * Show loading state in chart
   */
  showChartLoading() {
    if (this.chart) {
      this.chart.destroy()
    }

    const ctx = this.canvas.getContext("2d")
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = "#64748b"
    ctx.font = "16px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Loading chart data...", this.canvas.width / 2, this.canvas.height / 2)
  }

  /**
   * Show error state in chart
   */
  showChartError() {
    if (this.chart) {
      this.chart.destroy()
    }

    const ctx = this.canvas.getContext("2d")
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = "#ef4444"
    ctx.font = "16px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Failed to load chart data", this.canvas.width / 2, this.canvas.height / 2)
  }

  /**
   * Open chart modal
   */
  openModal() {
    this.modal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  /**
   * Close chart modal
   */
  closeModal() {
    this.modal.classList.remove("show")
    document.body.style.overflow = ""

    // Destroy chart when closing modal
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  }
}

// Create global instance
window.cryptoChart = new CryptoChart()
