'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getStrategies, getExchanges } from '@/lib/api'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function StrategyBacktest() {
  const [strategies, setStrategies] = useState<any[]>([])
  const [exchanges, setExchanges] = useState<any[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<string>('')
  const [selectedExchange, setSelectedExchange] = useState<string>('')
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USDT')
  const [days, setDays] = useState<number>(30)
  const [loading, setLoading] = useState<boolean>(false)
  const [backtestResults, setBacktestResults] = useState<any>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  // Fetch strategies and exchanges
  useEffect(() => {
    const fetchData = async () => {
      try {
        const strategiesData = await getStrategies()
        setStrategies(strategiesData)
        
        const exchangesData = await getExchanges()
        setExchanges(exchangesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    
    fetchData()
  }, [])

  // Setup WebSocket connection
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${wsProtocol}//${window.location.hostname}:12001/ws/trading/backtest/`
      
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('WebSocket connection established for backtesting')
      }
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          
          if (message.type === 'backtest_result') {
            setBacktestResults(message.result)
            setLoading(false)
          } else if (message.type === 'error') {
            toast.error(message.message)
            setLoading(false)
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        toast.error('WebSocket connection error')
      }
      
      setSocket(ws)
      
      // Clean up on unmount
      return () => {
        ws.close()
      }
    } catch (err) {
      console.error('Error setting up WebSocket:', err)
    }
  }, [])

  const runBacktest = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast.error('WebSocket connection not available')
      return
    }
    
    if (!selectedStrategy) {
      toast.error('Please select a strategy')
      return
    }
    
    setLoading(true)
    setBacktestResults(null)
    
    socket.send(JSON.stringify({
      type: 'backtest',
      backtest: {
        strategy_id: selectedStrategy,
        exchange_id: selectedExchange || undefined,
        symbol: selectedSymbol,
        days: days
      }
    }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Strategy Backtesting</CardTitle>
        <CardDescription>
          Test your trading strategies against historical data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select
                value={selectedStrategy}
                onValueChange={setSelectedStrategy}
              >
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange (Optional)</Label>
              <Select
                value={selectedExchange}
                onValueChange={setSelectedExchange}
              >
                <SelectTrigger id="exchange">
                  <SelectValue placeholder="Select exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Default Exchange</SelectItem>
                  {exchanges.map((exchange) => (
                    <SelectItem key={exchange.id} value={exchange.id}>
                      {exchange.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Select
                value={selectedSymbol}
                onValueChange={setSelectedSymbol}
              >
                <SelectTrigger id="symbol">
                  <SelectValue placeholder="Select symbol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                  <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                  <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="days">Backtest Period (Days)</Label>
              <Input
                id="days"
                type="number"
                min={1}
                max={365}
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 30)}
              />
            </div>
          </div>
          
          <Button onClick={runBacktest} disabled={loading} className="w-full">
            {loading ? 'Running Backtest...' : 'Run Backtest'}
          </Button>
          
          {backtestResults && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Initial Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(backtestResults.initial_value)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Final Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(backtestResults.final_value)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${backtestResults.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(backtestResults.profit_loss)} ({backtestResults.profit_loss_pct.toFixed(2)}%)
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">
                      {backtestResults.max_drawdown.toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="chart">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chart">Performance Chart</TabsTrigger>
                  <TabsTrigger value="trades">Trades ({backtestResults.trades.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="p-4">
                  {backtestResults.trades.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={backtestResults.trades.map((trade: any, index: number) => ({
                          name: formatDate(trade.date),
                          value: trade.portfolio_value + (trade.position * trade.price),
                          trade: trade
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any) => [formatCurrency(value), 'Portfolio Value']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No trades were executed during the backtest period
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="trades">
                  {backtestResults.trades.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Portfolio Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {backtestResults.trades.map((trade: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{formatDate(trade.date)}</TableCell>
                              <TableCell>
                                <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'}>
                                  {trade.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatCurrency(trade.price)}</TableCell>
                              <TableCell>{trade.quantity.toFixed(4)}</TableCell>
                              <TableCell>{formatCurrency(trade.portfolio_value)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No trades were executed during the backtest period
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}