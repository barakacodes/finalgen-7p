"use client"

import { useState, useEffect } from "react"
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
import StrategyBuilderForm from "@/components/strategy-builder-form"
import StrategyBacktest from "@/components/strategy-backtest"
import { getStrategies, deleteStrategy } from "@/lib/api"
import { toast } from "sonner"

interface StrategyBuilderProps {
  userTier: string
}

export function StrategyBuilder({ userTier }: StrategyBuilderProps) {
  const [selectedStrategy, setSelectedStrategy] = useState("")
  const [isBacktesting, setIsBacktesting] = useState(false)
  const [userStrategies, setUserStrategies] = useState<any[]>([])
  const [showStrategyForm, setShowStrategyForm] = useState(false)
  const [editingStrategy, setEditingStrategy] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("marketplace")

  // Fetch user strategies
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const strategies = await getStrategies()
        setUserStrategies(strategies)
      } catch (error) {
        console.error('Error fetching strategies:', error)
      }
    }
    
    fetchStrategies()
  }, [])

  const handleCreateStrategy = () => {
    setEditingStrategy(null)
    setShowStrategyForm(true)
    setActiveTab("builder")
  }

  const handleEditStrategy = (strategy: any) => {
    setEditingStrategy(strategy)
    setShowStrategyForm(true)
    setActiveTab("builder")
  }

  const handleDeleteStrategy = async (id: string) => {
    if (confirm('Are you sure you want to delete this strategy?')) {
      try {
        await deleteStrategy(id)
        setUserStrategies(userStrategies.filter(s => s.id !== id))
        toast.success('Strategy deleted successfully')
      } catch (error) {
        toast.error('Failed to delete strategy')
        console.error('Error deleting strategy:', error)
      }
    }
  }

  const handleSaveStrategy = (strategy: any) => {
    if (strategy) {
      // Update the list of strategies
      if (editingStrategy) {
        setUserStrategies(userStrategies.map(s => s.id === strategy.id ? strategy : s))
      } else {
        setUserStrategies([...userStrategies, strategy])
      }
    }
    
    setShowStrategyForm(false)
    setEditingStrategy(null)
    setActiveTab("my-strategies")
  }

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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="marketplace" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
          {showStrategyForm ? (
            <StrategyBuilderForm 
              existingStrategy={editingStrategy} 
              onSave={handleSaveStrategy} 
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Strategy Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <h3 className="text-xl font-medium text-white mb-4">Create a New Trading Strategy</h3>
                    <p className="text-slate-400 mb-6">
                      Configure your trading strategy parameters and test it with historical data
                    </p>
                    <Button onClick={handleCreateStrategy} className="mx-auto">
                      <Brain className="h-4 w-4 mr-2" />
                      Create New Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Strategy Types</CardTitle>
                  <CardDescription className="text-slate-400">
                    Choose from different strategy types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-slate-700 rounded-lg">
                      <h4 className="font-medium text-white">Momentum</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Follows market trends by buying assets that have been rising and selling those that have been falling.
                      </p>
                    </div>
                    
                    <div className="p-4 border border-slate-700 rounded-lg">
                      <h4 className="font-medium text-white">Mean Reversion</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Assumes that prices will revert to their historical average over time.
                      </p>
                    </div>
                    
                    <div className="p-4 border border-slate-700 rounded-lg">
                      <h4 className="font-medium text-white">Breakout</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Identifies when price breaks through support or resistance levels.
                      </p>
                    </div>
                    
                    <div className="p-4 border border-slate-700 rounded-lg">
                      <h4 className="font-medium text-white">Trend Following</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Uses moving averages to identify and follow market trends.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="backtest">
          <StrategyBacktest />
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
