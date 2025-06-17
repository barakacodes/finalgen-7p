"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Link, Unlink, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface ExchangeConnectorProps {
  userTier: string
}

export function ExchangeConnector({ userTier }: ExchangeConnectorProps) {
  const [connectedExchanges, setConnectedExchanges] = useState(["binance"])

  const exchanges = [
    {
      id: "binance",
      name: "Binance",
      logo: "🟡",
      status: "connected",
      features: ["Spot Trading", "Futures", "Options"],
      fees: "0.1%",
      supported: true,
    },
    {
      id: "coinbase",
      name: "Coinbase Pro",
      logo: "🔵",
      status: "disconnected",
      features: ["Spot Trading", "Advanced Orders"],
      fees: "0.5%",
      supported: true,
    },
    {
      id: "kraken",
      name: "Kraken",
      logo: "🟣",
      status: "disconnected",
      features: ["Spot Trading", "Futures", "Margin"],
      fees: "0.26%",
      supported: true,
    },
    {
      id: "bybit",
      name: "Bybit",
      logo: "🟠",
      status: "disconnected",
      features: ["Futures", "Options", "Copy Trading"],
      fees: "0.1%",
      supported: userTier !== "free",
    },
    {
      id: "okx",
      name: "OKX",
      logo: "⚫",
      status: "disconnected",
      features: ["Spot Trading", "Futures", "DEX"],
      fees: "0.1%",
      supported: userTier === "enterprise",
    },
  ]

  const apiConnections = [
    {
      exchange: "Binance",
      apiKey: "BNBXXXXXXXXXXXXX",
      permissions: ["Read", "Trade"],
      lastUsed: "2 minutes ago",
      status: "active",
    },
  ]

  const handleConnect = (exchangeId: string) => {
    setConnectedExchanges([...connectedExchanges, exchangeId])
  }

  const handleDisconnect = (exchangeId: string) => {
    setConnectedExchanges(connectedExchanges.filter((id) => id !== exchangeId))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="exchanges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
          <TabsTrigger value="exchanges" className="data-[state=active]:bg-purple-600">
            Exchanges
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="data-[state=active]:bg-purple-600">
            API Keys
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exchanges">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exchanges.map((exchange) => (
              <Card key={exchange.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exchange.logo}</span>
                      <div>
                        <CardTitle className="text-white">{exchange.name}</CardTitle>
                        <CardDescription className="text-slate-400">Trading fees: {exchange.fees}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={exchange.status === "connected" ? "default" : "outline"}
                      className={exchange.status === "connected" ? "bg-green-600" : ""}
                    >
                      {exchange.status === "connected" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {exchange.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-slate-400">Features</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exchange.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {exchange.supported ? (
                    <div className="flex gap-2">
                      {exchange.status === "connected" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex-1">
                              <Unlink className="h-4 w-4 mr-2" />
                              Disconnect
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-800 border-slate-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Disconnect Exchange</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-400">
                                Are you sure you want to disconnect from {exchange.name}? This will stop all active
                                trading strategies on this exchange.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDisconnect(exchange.id)}>
                                Disconnect
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button size="sm" className="flex-1" onClick={() => handleConnect(exchange.id)}>
                          <Link className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Badge variant="outline" className="mb-2">
                        {userTier === "free" ? "PRO REQUIRED" : "ENTERPRISE REQUIRED"}
                      </Badge>
                      <Button size="sm" variant="outline" disabled className="w-full">
                        Upgrade to Connect
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-keys">
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Add New API Connection</CardTitle>
                <CardDescription className="text-slate-400">
                  Connect your exchange API keys to enable automated trading
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Exchange</Label>
                    <select className="w-full mt-2 p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                      <option>Select Exchange</option>
                      <option>Binance</option>
                      <option>Coinbase Pro</option>
                      <option>Kraken</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-white">Environment</Label>
                    <select className="w-full mt-2 p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                      <option>Testnet (Paper Trading)</option>
                      <option>Mainnet (Live Trading)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-white">API Key</Label>
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Secret Key</Label>
                  <Input
                    type="password"
                    placeholder="Enter your secret key"
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Passphrase (if required)</Label>
                  <Input
                    type="password"
                    placeholder="Enter passphrase"
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm">
                    Ensure your API keys have only necessary permissions (Read + Trade, no Withdraw)
                  </span>
                </div>

                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Add & Test Connection
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Connected APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiConnections.map((connection, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{connection.exchange}</div>
                        <div className="text-sm text-slate-400">
                          Key: {connection.apiKey} • Last used: {connection.lastUsed}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {connection.permissions.map((perm, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={connection.status === "active" ? "default" : "secondary"}>
                          {connection.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Trading Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Auto-reconnect on disconnect</Label>
                    <p className="text-sm text-slate-400">Automatically reconnect to exchanges if connection is lost</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Rate limit protection</Label>
                    <p className="text-sm text-slate-400">
                      Prevent API rate limit violations with intelligent request throttling
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Emergency stop on high volatility</Label>
                    <p className="text-sm text-slate-400">Pause all trading during extreme market conditions</p>
                  </div>
                  <Switch />
                </div>

                <div>
                  <Label className="text-white">Max concurrent orders per exchange</Label>
                  <Input type="number" defaultValue="10" className="mt-2 bg-slate-700 border-slate-600 text-white" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">IP whitelist enforcement</Label>
                    <p className="text-sm text-slate-400">Only allow API access from whitelisted IPs</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Two-factor authentication</Label>
                    <p className="text-sm text-slate-400">Require 2FA for sensitive operations</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label className="text-white">Session timeout (minutes)</Label>
                  <Input type="number" defaultValue="30" className="mt-2 bg-slate-700 border-slate-600 text-white" />
                </div>

                <Button className="w-full">Save Security Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
