'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getMarketData, executeTrade } from '@/lib/api'

export default function TradingEngine() {
  const [marketData, setMarketData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [socketMessages, setSocketMessages] = useState<any[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT')

  // Fetch initial market data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getMarketData({ symbol: selectedSymbol, data_type: 'TICKER' })
        setMarketData(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch market data')
        console.error('Error fetching market data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [selectedSymbol])

  // Setup WebSocket connection
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${wsProtocol}//${window.location.hostname}:12001/ws/trading/default/`
      
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('WebSocket connection established')
        
        // Subscribe to market data
        ws.send(JSON.stringify({
          type: 'subscribe',
          symbol: selectedSymbol,
        }))
      }
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          
          if (message.type === 'market_data') {
            // Update market data if it matches our selected symbol
            if (message.data.symbol === selectedSymbol) {
              setMarketData(message.data)
            }
          }
          
          // Add message to history
          setSocketMessages((prev) => [...prev.slice(-9), message])
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('WebSocket connection error')
      }
      
      setSocket(ws)
      
      // Clean up on unmount
      return () => {
        ws.close()
      }
    } catch (err) {
      console.error('Error setting up WebSocket:', err)
      setError('Failed to establish WebSocket connection')
    }
  }, [selectedSymbol])

  // Execute a trade
  const handleTrade = async (tradeType: 'BUY' | 'SELL') => {
    try {
      const tradeData = {
        symbol: selectedSymbol,
        trade_type: tradeType,
        quantity: 0.01, // Small fixed quantity for demo
        exchange_id: '00000000-0000-0000-0000-000000000000', // Placeholder, would be a real ID in production
      }
      
      const result = await executeTrade(tradeData)
      console.log('Trade executed:', result)
      
      // In a real app, you would update the UI with the trade result
      alert(`${tradeType} order executed successfully!`)
    } catch (err: any) {
      setError(err.message || `Failed to execute ${tradeType} trade`)
      console.error('Error executing trade:', err)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Real-Time Trading Engine</CardTitle>
        <CardDescription>
          Powered by Django backend with WebSocket support
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedSymbol('BTC/USDT')}
              className={selectedSymbol === 'BTC/USDT' ? 'bg-primary text-primary-foreground' : ''}
            >
              BTC/USDT
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSelectedSymbol('ETH/USDT')}
              className={selectedSymbol === 'ETH/USDT' ? 'bg-primary text-primary-foreground' : ''}
            >
              ETH/USDT
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSelectedSymbol('SOL/USDT')}
              className={selectedSymbol === 'SOL/USDT' ? 'bg-primary text-primary-foreground' : ''}
            >
              SOL/USDT
            </Button>
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md">
              {error}
            </div>
          )}
          
          {loading && !marketData ? (
            <div className="text-center py-4">Loading market data...</div>
          ) : marketData ? (
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{marketData.symbol}</h3>
                <Badge variant={marketData.price > (marketData.low + marketData.high) / 2 ? 'default' : 'destructive'}>
                  {marketData.price}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">High:</span> {marketData.high}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Low:</span> {marketData.low}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Volume:</span> {marketData.volume}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Updated:</span>{' '}
                  {new Date(marketData.timestamp).toLocaleTimeString()}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleTrade('BUY')} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Buy
                </Button>
                <Button 
                  onClick={() => handleTrade('SELL')} 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Sell
                </Button>
              </div>
            </div>
          ) : null}
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">WebSocket Messages</h4>
            <div className="border rounded-lg p-2 h-40 overflow-y-auto text-xs">
              {socketMessages.length > 0 ? (
                socketMessages.map((msg, i) => (
                  <div key={i} className="border-b py-1 last:border-0">
                    <div className="font-mono">
                      {JSON.stringify(msg).substring(0, 100)}
                      {JSON.stringify(msg).length > 100 ? '...' : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-center py-4">
                  Waiting for WebSocket messages...
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}