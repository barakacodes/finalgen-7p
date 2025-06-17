"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, Activity, Play, Pause, AlertTriangle } from "lucide-react"

interface TradingDashboardProps {
  userTier: string
}

export function TradingDashboard({ userTier }: TradingDashboardProps) {
  const [isLiveTrading, setIsLiveTrading] = useState(false)
  const [isPaperTrading, setIsPaperTrading] = useState(true)
  const [portfolioValue, setPortfolioValue] = useState(10000)
  const [dailyPnL, setDailyPnL] = useState(0)

  // Mock real-time data
  const [performanceData, setPerformanceData] = useState([
    { time: "09:00", value: 10000, pnl: 0 },
    { time: "10:00", value: 10150, pnl: 150 },
    { time: "11:00", value: 10080, pnl: 80 },
    { time: "12:00", value: 10220, pnl: 220 },
    { time: "13:00", value: 10180, pnl: 180 },
    { time: "14:00", value: 10350, pnl: 350 },
  ])

  const activeStrategies = [
    { name: "RSI Mean Reversion", status: "active", pnl: 245.5, trades: 12 },
    { name: "MACD Momentum", status: "active", pnl: -89.2, trades: 8 },
    { name: "Bollinger Bands", status: "paused", pnl: 156.8, trades: 15 },
  ]

  const recentTrades = [
    { symbol: "BTC/USDT", side: "BUY", amount: 0.1, price: 43250, time: "14:32", pnl: 125.5 },
    { symbol: "ETH/USDT", side: "SELL", amount: 2.5, price: 2580, time: "14:28", pnl: -45.2 },
    { symbol: "SOL/USDT", side: "BUY", amount: 10, price: 98.5, time: "14:15", pnl: 78.9 },
  ]

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newValue = portfolioValue + (Math.random() - 0.5) * 100
      setPortfolioValue(newValue)
      setDailyPnL(newValue - 10000)
    }, 3000)

    return () => clearInterval(interval)
  }, [portfolioValue])

  return (
    <div className="space-y-6">
      {/* Trading Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Trading Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={isPaperTrading} onCheckedChange={setIsPaperTrading} disabled={userTier === "free"} />
                <span className="text-white">Paper Trading</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isLiveTrading}
                  onCheckedChange={setIsLiveTrading}
                  disabled={userTier === "free" || isPaperTrading}
                />
                <span className="text-white">Live Trading</span>
                {userTier === "free" && (
                  <Badge variant="outline" className="text-xs">
                    PRO ONLY
                  </Badge>
                )}
              </div>
            </div>
            <Button variant={isLiveTrading ? "destructive" : "default"} className="flex items-center gap-2">
              {isLiveTrading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isLiveTrading ? "Stop All" : "Start Trading"}
            </Button>
          </div>
          {!isPaperTrading && isLiveTrading && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">Live trading is active - real money at risk</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${portfolioValue.toFixed(2)}</div>
            <div className={`flex items-center gap-1 text-sm ${dailyPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
              {dailyPnL >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}$
              {Math.abs(dailyPnL).toFixed(2)} ({((dailyPnL / 10000) * 100).toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Active Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-slate-400">2 running, 1 paused</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Today's Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">35</div>
            <div className="text-sm text-green-400">68% win rate</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">Medium</div>
            <Progress value={45} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Portfolio Performance</CardTitle>
          <CardDescription className="text-slate-400">Real-time P&L tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Active Strategies and Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeStrategies.map((strategy, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{strategy.name}</div>
                    <div className="text-sm text-slate-400">{strategy.trades} trades today</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${strategy.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                      ${strategy.pnl.toFixed(2)}
                    </div>
                    <Badge variant={strategy.status === "active" ? "default" : "secondary"}>{strategy.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{trade.symbol}</div>
                    <div className="text-sm text-slate-400">
                      {trade.side} {trade.amount} @ ${trade.price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${trade.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                      ${trade.pnl.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">{trade.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
