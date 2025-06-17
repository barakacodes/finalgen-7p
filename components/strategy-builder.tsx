"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Brain, Code, Play, Settings, Copy, Trash2 } from "lucide-react"

interface StrategyBuilderProps {
  userTier: string
}

export function StrategyBuilder({ userTier }: StrategyBuilderProps) {
  const [selectedStrategy, setSelectedStrategy] = useState("")
  const [isBacktesting, setIsBacktesting] = useState(false)

  const predefinedStrategies = [
    {
      id: "rsi-mean-reversion",
      name: "RSI Mean Reversion",
      description: "Buy oversold, sell overbought based on RSI",
      category: "Technical",
      complexity: "Beginner",
      winRate: 68,
      sharpe: 1.45,
      maxDrawdown: -12.5,
    },
    {
      id: "macd-momentum",
      name: "MACD Momentum",
      description: "Trend following using MACD crossovers",
      category: "Technical",
      complexity: "Intermediate",
      winRate: 72,
      sharpe: 1.62,
      maxDrawdown: -8.3,
    },
    {
      id: "bollinger-bands",
      name: "Bollinger Bands Squeeze",
      description: "Volatility breakout strategy",
      category: "Technical",
      complexity: "Advanced",
      winRate: 65,
      sharpe: 1.38,
      maxDrawdown: -15.2,
    },
    {
      id: "grid-trading",
      name: "Grid Trading",
      description: "Place buy/sell orders at regular intervals",
      category: "Algorithmic",
      complexity: "Expert",
      winRate: 78,
      sharpe: 1.89,
      maxDrawdown: -6.8,
    },
  ]

  const backtestData = [
    { date: "2024-01", value: 10000, benchmark: 10000 },
    { date: "2024-02", value: 10250, benchmark: 10100 },
    { date: "2024-03", value: 10180, benchmark: 10050 },
    { date: "2024-04", value: 10420, benchmark: 10200 },
    { date: "2024-05", value: 10380, benchmark: 10150 },
    { date: "2024-06", value: 10650, benchmark: 10300 },
  ]

  const userStrategies = [
    { name: "My RSI Strategy", status: "active", pnl: 245.5, created: "2024-01-15" },
    { name: "Custom MACD", status: "paused", pnl: -89.2, created: "2024-01-10" },
    { name: "Bollinger Test", status: "backtesting", pnl: 0, created: "2024-01-20" },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-600">
            Strategy Marketplace
          </TabsTrigger>
          <TabsTrigger value="builder" className="data-[state=active]:bg-purple-600">
            Strategy Builder
          </TabsTrigger>
          <TabsTrigger value="backtest" className="data-[state=active]:bg-purple-600">
            Backtesting
          </TabsTrigger>
          <TabsTrigger value="my-strategies" className="data-[state=active]:bg-purple-600">
            My Strategies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predefinedStrategies.map((strategy) => (
              <Card key={strategy.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{strategy.name}</CardTitle>
                    <Badge variant="outline">{strategy.category}</Badge>
                  </div>
                  <CardDescription className="text-slate-400">{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Win Rate</span>
                      <div className="text-green-400 font-medium">{strategy.winRate}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Sharpe Ratio</span>
                      <div className="text-white font-medium">{strategy.sharpe}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Max Drawdown</span>
                      <div className="text-red-400 font-medium">{strategy.maxDrawdown}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Complexity</span>
                      <div className="text-white font-medium">{strategy.complexity}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Deploy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Code className="h-4 w-4 mr-2" />
                      View Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Strategy Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Strategy Name</Label>
                  <Input placeholder="My Custom Strategy" className="mt-2 bg-slate-700 border-slate-600 text-white" />
                </div>

                <div>
                  <Label className="text-white">Base Strategy</Label>
                  <Select>
                    <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select base strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rsi">RSI Mean Reversion</SelectItem>
                      <SelectItem value="macd">MACD Momentum</SelectItem>
                      <SelectItem value="bb">Bollinger Bands</SelectItem>
                      <SelectItem value="custom">Custom (Code)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">RSI Period</Label>
                    <Input type="number" defaultValue="14" className="mt-2 bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-white">RSI Threshold</Label>
                    <Input type="number" defaultValue="30" className="mt-2 bg-slate-700 border-slate-600 text-white" />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Risk Management</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Stop Loss (%)</span>
                      <Input type="number" defaultValue="5" className="w-20 bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Take Profit (%)</span>
                      <Input
                        type="number"
                        defaultValue="10"
                        className="w-20 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Position Size (%)</span>
                      <Input
                        type="number"
                        defaultValue="25"
                        className="w-20 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Custom Code</CardTitle>
                <CardDescription className="text-slate-400">
                  Advanced users can write custom trading logic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`// Custom strategy code
function onTick(data) {
  const rsi = calculateRSI(data.prices, 14);
  
  if (rsi < 30 && !hasPosition()) {
    buy(data.symbol, 0.1);
  } else if (rsi > 70 && hasPosition()) {
    sell(data.symbol, getPosition().size);
  }
}`}
                  className="min-h-[300px] bg-slate-700 border-slate-600 text-white font-mono text-sm"
                  disabled={userTier === "free"}
                />
                {userTier === "free" && (
                  <div className="mt-2 text-sm text-slate-400">Custom code editing requires PRO subscription</div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1">Save Strategy</Button>
                  <Button variant="outline">Test Syntax</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backtest">
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Backtest Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-white">Strategy</Label>
                    <Select>
                      <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rsi">RSI Mean Reversion</SelectItem>
                        <SelectItem value="macd">MACD Momentum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Start Date</Label>
                    <Input
                      type="date"
                      defaultValue="2024-01-01"
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">End Date</Label>
                    <Input
                      type="date"
                      defaultValue="2024-06-30"
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Initial Capital</Label>
                    <Input
                      type="number"
                      defaultValue="10000"
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <Button className="mt-4" disabled={isBacktesting}>
                  {isBacktesting ? "Running Backtest..." : "Start Backtest"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Backtest Results</CardTitle>
                <CardDescription className="text-slate-400">Strategy performance vs benchmark</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={backtestData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#8B5CF6" name="Strategy" strokeWidth={2} />
                    <Line type="monotone" dataKey="benchmark" stroke="#06B6D4" name="Benchmark" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="my-strategies">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">My Strategies</h3>
              <Button>
                <Brain className="h-4 w-4 mr-2" />
                Create New Strategy
              </Button>
            </div>

            <div className="grid gap-4">
              {userStrategies.map((strategy, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-white">{strategy.name}</h4>
                          <p className="text-sm text-slate-400">Created: {strategy.created}</p>
                        </div>
                        <Badge
                          variant={
                            strategy.status === "active"
                              ? "default"
                              : strategy.status === "paused"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {strategy.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`font-medium ${strategy.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                            ${strategy.pnl.toFixed(2)}
                          </div>
                          <div className="text-sm text-slate-400">P&L</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
