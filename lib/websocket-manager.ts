// WebSocket Manager for Real-time Data
export class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map()
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()
  private reconnectAttempts: Map<string, number> = new Map()
  private maxReconnectAttempts = 5

  // Connect to exchange WebSocket
  connect(exchangeId: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(url)

        ws.onopen = () => {
          console.log(`Connected to ${exchangeId} WebSocket`)
          this.connections.set(exchangeId, ws)
          this.reconnectAttempts.set(exchangeId, 0)
          resolve()
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.notifySubscribers(exchangeId, data)
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error)
          }
        }

        ws.onclose = () => {
          console.log(`Disconnected from ${exchangeId} WebSocket`)
          this.handleReconnect(exchangeId, url)
        }

        ws.onerror = (error) => {
          console.error(`WebSocket error for ${exchangeId}:`, error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // Subscribe to market data updates
  subscribe(exchangeId: string, callback: (data: any) => void): void {
    if (!this.subscribers.has(exchangeId)) {
      this.subscribers.set(exchangeId, new Set())
    }
    this.subscribers.get(exchangeId)!.add(callback)
  }

  // Unsubscribe from updates
  unsubscribe(exchangeId: string, callback: (data: any) => void): void {
    const subs = this.subscribers.get(exchangeId)
    if (subs) {
      subs.delete(callback)
    }
  }

  // Send message to exchange
  send(exchangeId: string, message: any): void {
    const ws = this.connections.get(exchangeId)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  // Disconnect from exchange
  disconnect(exchangeId: string): void {
    const ws = this.connections.get(exchangeId)
    if (ws) {
      ws.close()
      this.connections.delete(exchangeId)
      this.subscribers.delete(exchangeId)
    }
  }

  private notifySubscribers(exchangeId: string, data: any): void {
    const subs = this.subscribers.get(exchangeId)
    if (subs) {
      subs.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error("Subscriber callback error:", error)
        }
      })
    }
  }

  private handleReconnect(exchangeId: string, url: string): void {
    const attempts = this.reconnectAttempts.get(exchangeId) || 0

    if (attempts < this.maxReconnectAttempts) {
      const delay = Math.pow(2, attempts) * 1000 // Exponential backoff

      setTimeout(() => {
        console.log(`Attempting to reconnect to ${exchangeId} (attempt ${attempts + 1})`)
        this.reconnectAttempts.set(exchangeId, attempts + 1)
        this.connect(exchangeId, url).catch(console.error)
      }, delay)
    } else {
      console.error(`Max reconnection attempts reached for ${exchangeId}`)
    }
  }
}

// Market Data Aggregator
export class MarketDataAggregator {
  private wsManager: WebSocketManager
  private latestData: Map<string, any> = new Map()
  private dataCallbacks: Set<(data: any) => void> = new Set()

  constructor() {
    this.wsManager = new WebSocketManager()
  }

  // Add exchange data feed
  async addFeed(exchangeId: string, config: ExchangeFeedConfig): Promise<void> {
    await this.wsManager.connect(exchangeId, config.url)

    this.wsManager.subscribe(exchangeId, (data) => {
      this.processMarketData(exchangeId, data)
    })

    // Send subscription message
    if (config.subscribeMessage) {
      this.wsManager.send(exchangeId, config.subscribeMessage)
    }
  }

  // Subscribe to aggregated market data
  onData(callback: (data: any) => void): void {
    this.dataCallbacks.add(callback)
  }

  private processMarketData(exchangeId: string, rawData: any): void {
    // Process and normalize data from different exchanges
    const normalizedData = this.normalizeData(exchangeId, rawData)

    if (normalizedData) {
      this.latestData.set(`${exchangeId}_${normalizedData.symbol}`, normalizedData)

      // Notify subscribers
      this.dataCallbacks.forEach((callback) => {
        try {
          callback(normalizedData)
        } catch (error) {
          console.error("Data callback error:", error)
        }
      })
    }
  }

  private normalizeData(exchangeId: string, rawData: any): any {
    // Normalize data format across different exchanges
    switch (exchangeId) {
      case "binance":
        return this.normalizeBinanceData(rawData)
      case "coinbase":
        return this.normalizeCoinbaseData(rawData)
      default:
        return rawData
    }
  }

  private normalizeBinanceData(data: any): any {
    if (data.e === "24hrTicker") {
      return {
        exchange: "binance",
        symbol: data.s,
        price: Number.parseFloat(data.c),
        change: Number.parseFloat(data.P),
        volume: Number.parseFloat(data.v),
        timestamp: data.E,
      }
    }
    return null
  }

  private normalizeCoinbaseData(data: any): any {
    if (data.type === "ticker") {
      return {
        exchange: "coinbase",
        symbol: data.product_id,
        price: Number.parseFloat(data.price),
        volume: Number.parseFloat(data.volume_24h),
        timestamp: new Date(data.time).getTime(),
      }
    }
    return null
  }
}

export interface ExchangeFeedConfig {
  url: string
  subscribeMessage?: any
  symbols?: string[]
}
