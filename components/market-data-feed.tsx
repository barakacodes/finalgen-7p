"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Wifi, WifiOff, Zap } from "lucide-react"

interface MarketDataFeedProps {
  userTier: string
}

export function MarketDataFeed({ userTier }: MarketDataFeedProps) {
  const [isConnected, setIsConnected] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USDT")
  const [dataLatency, setDataLatency] = useState(12)

  const marketData = [
    {
      symbol: "BTC/USDT",
      price: 43250.5,
      change: 2.45,
      changePercent: 5.67,
      volume: "1.2B",
      high24h: 44100,
      low24h: 42800,
      status: "active",
    },
    {
      symbol: "ETH/USDT",
      price: 2580.25,
      change: -45.2,
      changePercent: -1.72,
      volume: "890M",
      high24h: 2650,
      low24h: 2520,
      status: "active",
    },
    {
      symbol: "SOL/USDT",
      price: 98.5,
      change: 8.9,
      changePercent: 9.93,
      volume: "245M",
      high24h: 102,
      low24h: 89,
      status: "active",
    },
    {
      symbol: "ADA/USDT",
      price: 0.485,
      change: 0.025,
      changePercent: 5.43,
      volume: "156M",
      high24h: 0.495,
      low24h: 0.46,
      status: userTier === "free" ? "limited" : "active",
    },
  ]

  const priceHistory = [
    { time: "09:00", price: 43000 },
    { time: "09:15", price: 43150 },
    { time: "09:30", price: 43080 },
    { time: "09:45", price: 43220 },
    { time: "10:00", price: 43180 },
    { time: "10:15", price: 43350 },
    { time: "10:30", price: 43250 },
  ]

  const orderBookData = {
    bids: [
      { price: 43249.5, size: 0.125, total: 0.125 },
      { price: 43248.0, size: 0.25, total: 0.375 },
      { price: 43247.5, size: 0.1, total: 0.475 },
      { price: 43246.0, size: 0.3, total: 0.775 },
      { price: 43245.5, size: 0.15, total: 0.925 },
    ],
    asks: [
      { price: 43251.0, size: 0.2, total: 0.2 },
      { price: 43252.5, size: 0.175, total: 0.375 },
      { price: 43253.0, size: 0.125, total: 0.5 },
      { price: 43254.5, size: 0.3, total: 0.8 },
      { price: 43255.0, size: 0.1, total: 0.9 },
    ],
  }

  const dataFeeds = [
    { name: "Binance WebSocket", status: "connected", latency: 12, tier: "free", primary: true },
    { name: "Coinbase Pro Feed", status: "connected", latency: 18, tier: "free" },
    { name: "Kraken WebSocket", status: "connected", latency: 25, tier: "pro" },
    { name: "FTX Real-time", status: "disconnected", latency: 0, tier: "pro" },
    { name: "Bloomberg Terminal", status: "connected", latency: 8, tier: "enterprise" },
    { name: "Reuters Eikon", status: "connected", latency: 15, tier: "enterprise" },
  ]

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setDataLatency(Math.floor(Math.random() * 20) + 5)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {isConnected ? <Wifi className="h-5 w-5 text-green-400" /> : <WifiOff className="h-5 w-5 text-red-400" />}
            Market Data Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{dataLatency}ms</div>
              <div className="text-sm text-slate-400">Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">99.9%</div>
              <div className="text-sm text-slate-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-sm text-slate-400">Symbols</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Real-time</div>
              <div className="text-sm text-slate-400">Updates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="watchlist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="watchlist" className="data-[state=active]:bg-purple-600">
            Watchlist
          </TabsTrigger>
          <TabsTrigger value="orderbook" className="data-[state=active]:bg-purple-600">
            Order Book
          </TabsTrigger>
          <TabsTrigger value="feeds" className="data-[state=active]:bg-purple-600">
            Data Feeds
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-purple-600">
            Price Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Market Overview</CardTitle>
                <CardDescription className="text-slate-400">Real-time price data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketData.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedSymbol === item.symbol
                          ? "bg-purple-600/20 border border-purple-500/30"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                      onClick={() => setSelectedSymbol(item.symbol)}
                    >
                      <div>
                        <div className="font-medium text-white">{item.symbol}</div>
                        <div className="text-sm text-slate-400">Vol: {item.volume}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">${item.price.toLocaleString()}</div>
                        <div
                          className={`text-sm flex items-center gap-1 ${
                            item.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {item.changePercent.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <Badge
                          variant={item.status === "active" ? "default" : "outline"}
                          className={item.status === "limited" ? "bg-yellow-600" : ""}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedSymbol} Price Chart</CardTitle>
                <CardDescription className="text-slate-400">15-minute intervals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory}>
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
                    <Line type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orderbook">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">{selectedSymbol} Order Book</CardTitle>
              <CardDescription className="text-slate-400">Real-time bid/ask data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-green-400 font-medium mb-3">Bids</h4>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-4 text-xs text-slate-400 pb-2 border-b border-slate-600">
                      <span>Price</span>
                      <span>Size</span>
                      <span>Total</span>
                    </div>
                    {orderBookData.bids.map((bid, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                        <span className="text-green-400">${bid.price.toLocaleString()}</span>
                        <span className="text-white">{bid.size}</span>
                        <span className="text-slate-400">{bid.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-red-400 font-medium mb-3">Asks</h4>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-4 text-xs text-slate-400 pb-2 border-b border-slate-600">
                      <span>Price</span>
                      <span>Size</span>
                      <span>Total</span>
                    </div>
                    {orderBookData.asks.map((ask, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                        <span className="text-red-400">${ask.price.toLocaleString()}</span>
                        <span className="text-white">{ask.size}</span>
                        <span className="text-slate-400">{ask.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feeds">
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Data Feed Sources</CardTitle>
                <CardDescription className="text-slate-400">Manage your market data connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataFeeds
                    .sort((a, b) => (a.primary ? -1 : b.primary ? 1 : 0))
                    .map((feed, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              feed.status === "connected" ? "bg-green-400" : "bg-red-400"
                            }`}
                          />
                          <div>
                            <div className="font-medium text-white">
                              {feed.name} {feed.primary && <Badge className="ml-2">Primary</Badge>}
                            </div>
                            <div className="text-sm text-slate-400">
                              {feed.status === "connected" ? `${feed.latency}ms latency` : "Disconnected"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={feed.tier === "free" ? "outline" : feed.tier === "pro" ? "secondary" : "default"}
                          >
                            {feed.tier.toUpperCase()}
                          </Badge>
                          {(feed.tier === "pro" && userTier === "free") ||
                          (feed.tier === "enterprise" && userTier !== "enterprise") ? (
                            <Button size="sm" variant="outline" disabled>
                              Upgrade Required
                            </Button>
                          ) : (
                            <Switch checked={feed.status === "connected"} disabled={feed.name === "FTX Real-time"} />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Custom Data Feed</CardTitle>
                <CardDescription className="text-slate-400">Add your own data source</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Feed Name</Label>
                    <Input
                      placeholder="My Custom Feed"
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      disabled={userTier === "free"}
                    />
                  </div>
                  <div>
                    <Label className="text-white">WebSocket URL</Label>
                    <Input
                      placeholder="wss://api.example.com/ws"
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      disabled={userTier === "free"}
                    />
                  </div>
                </div>
                <Button disabled={userTier === "free"} className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Add Custom Feed {userTier === "free" && "(PRO REQUIRED)"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Create Price Alert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Symbol</Label>
                  <select className="w-full mt-2 p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                    <option>BTC/USDT</option>
                    <option>ETH/USDT</option>
                    <option>SOL/USDT</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Condition</Label>
                    <select className="w-full mt-2 p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                      <option>Price Above</option>
                      <option>Price Below</option>
                      <option>% Change Above</option>
                      <option>% Change Below</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-white">Value</Label>
                    <Input
                      type="number"
                      placeholder="45000"
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Notification Method</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-white">Email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-white">SMS</span>
                      {userTier === "free" && (
                        <Badge variant="outline" className="text-xs">
                          PRO
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-white">Webhook</span>
                      {userTier !== "enterprise" && (
                        <Badge variant="outline" className="text-xs">
                          ENTERPRISE
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button className="w-full">Create Alert</Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <div className="font-medium text-white">BTC/USDT &gt; $45,000</div>
                      <div className="text-sm text-slate-400">Email notification</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Delete
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <div className="font-medium text-white">ETH/USDT &lt; $2,500</div>
                      <div className="text-sm text-slate-400">Email + SMS</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
