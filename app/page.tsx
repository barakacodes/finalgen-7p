"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TradingDashboard } from "@/components/trading-dashboard"
import { PortfolioManager } from "@/components/portfolio-manager"
import { StrategyBuilder } from "@/components/strategy-builder"
import { SubscriptionPlans } from "@/components/subscription-plans"
import { ExchangeConnector } from "@/components/exchange-connector"
import { MarketDataFeed } from "@/components/market-data-feed"
import { Bot, Crown } from "lucide-react"

export default function TradingBotPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [userTier, setUserTier] = useState("free") // free, pro, enterprise

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">TradingBot Pro</h1>
              <p className="text-purple-200">Advanced Algorithmic Trading Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={userTier === "enterprise" ? "default" : userTier === "pro" ? "secondary" : "outline"}>
              {userTier === "enterprise" ? <Crown className="h-4 w-4 mr-1" /> : null}
              {userTier.toUpperCase()} TIER
            </Badge>
            <Button variant="outline" onClick={() => setActiveTab("subscription")}>
              Upgrade Plan
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-600">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="strategies" className="data-[state=active]:bg-purple-600">
              Strategies
            </TabsTrigger>
            <TabsTrigger value="exchanges" className="data-[state=active]:bg-purple-600">
              Exchanges
            </TabsTrigger>
            <TabsTrigger value="market-data" className="data-[state=active]:bg-purple-600">
              Market Data
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-purple-600">
              Subscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <TradingDashboard userTier={userTier} />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioManager userTier={userTier} />
          </TabsContent>

          <TabsContent value="strategies">
            <StrategyBuilder userTier={userTier} />
          </TabsContent>

          <TabsContent value="exchanges">
            <ExchangeConnector userTier={userTier} />
          </TabsContent>

          <TabsContent value="market-data">
            <MarketDataFeed userTier={userTier} />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionPlans currentTier={userTier} onUpgrade={setUserTier} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
