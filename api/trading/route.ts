import { type NextRequest, NextResponse } from "next/server"
import { TradingEngine, RSIStrategy } from "@/lib/trading-engine"

// Initialize trading engine (in production, this would be a singleton service)
const tradingEngine = new TradingEngine()

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case "start_trading":
        tradingEngine.startTrading()
        return NextResponse.json({ success: true, message: "Trading started" })

      case "stop_trading":
        tradingEngine.stopTrading()
        return NextResponse.json({ success: true, message: "Trading stopped" })

      case "add_strategy":
        const strategy = new RSIStrategy(data.parameters)
        tradingEngine.addStrategy(strategy)
        return NextResponse.json({ success: true, strategyId: strategy.id })

      case "remove_strategy":
        tradingEngine.removeStrategy(data.strategyId)
        return NextResponse.json({ success: true, message: "Strategy removed" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Trading API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    switch (type) {
      case "status":
        return NextResponse.json({
          isActive: true, // Get from trading engine
          strategies: [], // Get active strategies
          portfolio: {}, // Get portfolio data
        })

      case "performance":
        return NextResponse.json({
          totalReturn: 8.5,
          dailyPnL: 245.5,
          winRate: 68.5,
          sharpeRatio: 1.85,
        })

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Trading API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
