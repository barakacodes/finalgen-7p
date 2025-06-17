"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { TrendingUp, Shield, Settings, Plus, Minus } from "lucide-react"

interface PortfolioManagerProps {
  userTier: string
}

export function PortfolioManager({ userTier }: PortfolioManagerProps) {
  const [selectedAsset, setSelectedAsset] = useState("")
  const [riskLevel, setRiskLevel] = useState("medium")

  const portfolioData = [
    { name: "BTC", value: 4500, percentage: 45, color: "#F7931A" },
    { name: "ETH", value: 2500, percentage: 25, color: "#627EEA" },
    { name: "SOL", value: 1500, percentage: 15, color: "#9945FF" },
    { name: "USDT", value: 1000, percentage: 10, color: "#26A17B" },
    { name: "Others", value: 500, percentage: 5, color: "#8B5CF6" },
  ]

  const performanceData = [
    { asset: "BTC", return: 12.5, allocation: 45 },
    { asset: "ETH", return: 8.3, allocation: 25 },
    { asset: "SOL", return: 15.7, allocation: 15 },
    { asset: "USDT", return: 0.1, allocation: 10 },
    { asset: "Others", return: 6.2, allocation: 5 },
  ]

  const riskMetrics = {
    sharpeRatio: 1.85,
    maxDrawdown: -8.5,
    volatility: 15.2,
    beta: 0.92,
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$10,000</div>
            <div className="flex items-center gap-1 text-sm text-green-400">
              <TrendingUp className="h-4 w-4" />
              +8.5% (30d)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{riskMetrics.sharpeRatio}</div>
            <div className="text-sm text-green-400">Excellent</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{riskMetrics.maxDrawdown}%</div>
            <div className="text-sm text-yellow-400">Moderate</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{riskMetrics.volatility}%</div>
            <div className="text-sm text-slate-400">Annualized</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="allocation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="allocation" className="data-[state=active]:bg-purple-600">
            Allocation
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-600">
            Performance
          </TabsTrigger>
          <TabsTrigger value="rebalance" className="data-[state=active]:bg-purple-600">
            Rebalance
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-purple-600">
            Risk Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allocation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Asset Allocation</CardTitle>
                <CardDescription className="text-slate-400">Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }} />
                        <div>
                          <div className="font-medium text-white">{asset.name}</div>
                          <div className="text-sm text-slate-400">{asset.percentage}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">${asset.value}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Asset Performance</CardTitle>
              <CardDescription className="text-slate-400">30-day returns vs allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="asset" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="return" fill="#8B5CF6" name="Return %" />
                  <Bar dataKey="allocation" fill="#06B6D4" name="Allocation %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rebalance">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Portfolio Rebalancing</CardTitle>
              <CardDescription className="text-slate-400">Optimize your asset allocation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-white">Target Allocation</Label>
                  {portfolioData.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white">{asset.name}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue={asset.percentage}
                          className="w-20 bg-slate-700 border-slate-600 text-white"
                        />
                        <span className="text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <Label className="text-white">Rebalancing Strategy</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Conservative (5% threshold)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Moderate (10% threshold)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Aggressive (15% threshold)
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1">Preview Rebalance</Button>
                <Button variant="outline" className="flex-1" disabled={userTier === "free"}>
                  Auto-Rebalance {userTier === "free" && "(PRO)"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Sharpe Ratio</span>
                  <span className="text-white font-medium">{riskMetrics.sharpeRatio}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Max Drawdown</span>
                  <span className="text-red-400 font-medium">{riskMetrics.maxDrawdown}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Volatility</span>
                  <span className="text-yellow-400 font-medium">{riskMetrics.volatility}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Beta</span>
                  <span className="text-white font-medium">{riskMetrics.beta}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Position Size Limit</Label>
                  <Input type="number" defaultValue="25" className="mt-2 bg-slate-700 border-slate-600 text-white" />
                  <span className="text-xs text-slate-400">Maximum % per position</span>
                </div>
                <div>
                  <Label className="text-white">Stop Loss</Label>
                  <Input type="number" defaultValue="5" className="mt-2 bg-slate-700 border-slate-600 text-white" />
                  <span className="text-xs text-slate-400">% loss to trigger stop</span>
                </div>
                <Button className="w-full">Update Risk Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
