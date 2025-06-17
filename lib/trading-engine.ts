// Trading Engine Core Logic
export class TradingEngine {
  private strategies: Map<string, TradingStrategy> = new Map()
  private exchanges: Map<string, ExchangeConnector> = new Map()
  private portfolio: Portfolio
  private riskManager: RiskManager
  private isLiveTrading = false

  constructor() {
    this.portfolio = new Portfolio()
    this.riskManager = new RiskManager()
  }

  // Strategy Management
  addStrategy(strategy: TradingStrategy): void {
    this.strategies.set(strategy.id, strategy)
  }

  removeStrategy(strategyId: string): void {
    const strategy = this.strategies.get(strategyId)
    if (strategy) {
      strategy.stop()
      this.strategies.delete(strategyId)
    }
  }

  // Exchange Management
  addExchange(exchange: ExchangeConnector): void {
    this.exchanges.set(exchange.id, exchange)
  }

  // Trading Controls
  startTrading(): void {
    if (!this.isLiveTrading) {
      this.isLiveTrading = true
      this.strategies.forEach((strategy) => strategy.start())
    }
  }

  stopTrading(): void {
    if (this.isLiveTrading) {
      this.isLiveTrading = false
      this.strategies.forEach((strategy) => strategy.stop())
    }
  }

  // Order Execution
  async executeOrder(order: Order): Promise<OrderResult> {
    // Risk checks
    if (!this.riskManager.validateOrder(order, this.portfolio)) {
      throw new Error("Order rejected by risk management")
    }

    const exchange = this.exchanges.get(order.exchangeId)
    if (!exchange) {
      throw new Error("Exchange not connected")
    }

    try {
      const result = await exchange.executeOrder(order)
      this.portfolio.updatePosition(result)
      return result
    } catch (error) {
      console.error("Order execution failed:", error)
      throw error
    }
  }
}

// Strategy Base Class
export abstract class TradingStrategy {
  public id: string
  public name: string
  public isActive = false
  protected parameters: Record<string, any>

  constructor(id: string, name: string, parameters: Record<string, any> = {}) {
    this.id = id
    this.name = name
    this.parameters = parameters
  }

  abstract onTick(marketData: MarketData): Promise<Signal[]>

  start(): void {
    this.isActive = true
  }

  stop(): void {
    this.isActive = false
  }
}

// RSI Strategy Implementation
export class RSIStrategy extends TradingStrategy {
  private rsiPeriod: number
  private oversoldThreshold: number
  private overboughtThreshold: number

  constructor(parameters: any) {
    super("rsi-strategy", "RSI Mean Reversion", parameters)
    this.rsiPeriod = parameters.rsiPeriod || 14
    this.oversoldThreshold = parameters.oversoldThreshold || 30
    this.overboughtThreshold = parameters.overboughtThreshold || 70
  }

  async onTick(marketData: MarketData): Promise<Signal[]> {
    const signals: Signal[] = []

    for (const symbol of Object.keys(marketData.prices)) {
      const prices = marketData.prices[symbol]
      const rsi = this.calculateRSI(prices, this.rsiPeriod)

      if (rsi < this.oversoldThreshold) {
        signals.push({
          symbol,
          side: "BUY",
          type: "MARKET",
          quantity: this.calculatePositionSize(symbol, marketData),
          reason: `RSI oversold: ${rsi.toFixed(2)}`,
        })
      } else if (rsi > this.overboughtThreshold) {
        signals.push({
          symbol,
          side: "SELL",
          type: "MARKET",
          quantity: this.calculatePositionSize(symbol, marketData),
          reason: `RSI overbought: ${rsi.toFixed(2)}`,
        })
      }
    }

    return signals
  }

  private calculateRSI(prices: number[], period: number): number {
    if (prices.length < period + 1) return 50

    let gains = 0
    let losses = 0

    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1]
      if (change > 0) gains += change
      else losses += Math.abs(change)
    }

    const avgGain = gains / period
    const avgLoss = losses / period
    const rs = avgGain / avgLoss

    return 100 - 100 / (1 + rs)
  }

  private calculatePositionSize(symbol: string, marketData: MarketData): number {
    // Simple position sizing - 1% of portfolio
    return 0.01
  }
}

// Portfolio Management
export class Portfolio {
  private positions: Map<string, Position> = new Map()
  private cash = 10000
  private totalValue = 10000

  updatePosition(orderResult: OrderResult): void {
    const position = this.positions.get(orderResult.symbol) || {
      symbol: orderResult.symbol,
      quantity: 0,
      averagePrice: 0,
      unrealizedPnL: 0,
    }

    if (orderResult.side === "BUY") {
      const newQuantity = position.quantity + orderResult.quantity
      position.averagePrice =
        (position.averagePrice * position.quantity + orderResult.price * orderResult.quantity) / newQuantity
      position.quantity = newQuantity
    } else {
      position.quantity -= orderResult.quantity
    }

    this.positions.set(orderResult.symbol, position)
    this.cash -= orderResult.quantity * orderResult.price * (orderResult.side === "BUY" ? 1 : -1)
  }

  getPositions(): Position[] {
    return Array.from(this.positions.values())
  }

  getTotalValue(): number {
    return this.totalValue
  }
}

// Risk Management
export class RiskManager {
  private maxPositionSize = 0.25 // 25% max per position
  private maxDrawdown = 0.1 // 10% max drawdown
  private stopLossPercent = 0.05 // 5% stop loss

  validateOrder(order: Order, portfolio: Portfolio): boolean {
    // Position size check
    const positionValue = order.quantity * order.price
    const portfolioValue = portfolio.getTotalValue()

    if (positionValue / portfolioValue > this.maxPositionSize) {
      console.log("Order rejected: Position size too large")
      return false
    }

    // Additional risk checks would go here
    return true
  }
}

// Type Definitions
export interface MarketData {
  prices: Record<string, number[]>
  volumes: Record<string, number[]>
  timestamp: number
}

export interface Signal {
  symbol: string
  side: "BUY" | "SELL"
  type: "MARKET" | "LIMIT"
  quantity: number
  price?: number
  reason: string
}

export interface Order {
  id: string
  symbol: string
  side: "BUY" | "SELL"
  type: "MARKET" | "LIMIT"
  quantity: number
  price?: number
  exchangeId: string
}

export interface OrderResult {
  orderId: string
  symbol: string
  side: "BUY" | "SELL"
  quantity: number
  price: number
  timestamp: number
}

export interface Position {
  symbol: string
  quantity: number
  averagePrice: number
  unrealizedPnL: number
}

export abstract class ExchangeConnector {
  public id: string
  public name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }

  abstract connect(): Promise<void>
  abstract disconnect(): Promise<void>
  abstract executeOrder(order: Order): Promise<OrderResult>
  abstract getMarketData(symbols: string[]): Promise<MarketData>
}
