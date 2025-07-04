'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { createStrategy, updateStrategy } from '@/lib/api'
import { toast } from 'sonner'

interface StrategyBuilderFormProps {
  existingStrategy?: any
  onSave?: (strategy: any) => void
}

export default function StrategyBuilderForm({ existingStrategy, onSave }: StrategyBuilderFormProps) {
  const [strategyType, setStrategyType] = useState(existingStrategy?.strategy_type || 'MOMENTUM')
  const [name, setName] = useState(existingStrategy?.name || '')
  const [description, setDescription] = useState(existingStrategy?.description || '')
  const [isActive, setIsActive] = useState(existingStrategy?.is_active || false)
  const [parameters, setParameters] = useState(existingStrategy?.parameters || {})
  const [loading, setLoading] = useState(false)

  const handleParameterChange = (key: string, value: any) => {
    setParameters({
      ...parameters,
      [key]: value,
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      const strategyData = {
        name,
        description,
        strategy_type: strategyType,
        parameters,
        is_active: isActive,
      }
      
      let result
      
      if (existingStrategy?.id) {
        result = await updateStrategy(existingStrategy.id, strategyData)
      } else {
        result = await createStrategy(strategyData)
      }
      
      toast.success(`Strategy ${existingStrategy ? 'updated' : 'created'} successfully`)
      
      if (onSave) {
        onSave(result)
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message || 'Failed to save strategy'}`)
      console.error('Error saving strategy:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderParameterInputs = () => {
    switch (strategyType) {
      case 'MOMENTUM':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lookback_period">Lookback Period</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="lookback_period"
                  min={1}
                  max={48}
                  step={1}
                  value={[parameters.lookback_period || 12]}
                  onValueChange={(value) => handleParameterChange('lookback_period', value[0])}
                />
                <span className="w-12 text-center">{parameters.lookback_period || 12}</span>
              </div>
              <p className="text-sm text-muted-foreground">Number of periods to look back for momentum calculation</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="threshold"
                  min={0.01}
                  max={0.1}
                  step={0.01}
                  value={[parameters.threshold || 0.02]}
                  onValueChange={(value) => handleParameterChange('threshold', value[0])}
                />
                <span className="w-12 text-center">{parameters.threshold || 0.02}</span>
              </div>
              <p className="text-sm text-muted-foreground">Momentum threshold for trade signals</p>
            </div>
          </div>
        )
        
      case 'MEAN_REVERSION':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="window">Moving Average Window</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="window"
                  min={5}
                  max={50}
                  step={1}
                  value={[parameters.window || 20]}
                  onValueChange={(value) => handleParameterChange('window', value[0])}
                />
                <span className="w-12 text-center">{parameters.window || 20}</span>
              </div>
              <p className="text-sm text-muted-foreground">Number of periods for moving average calculation</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="std_dev">Standard Deviation Multiplier</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="std_dev"
                  min={1}
                  max={3}
                  step={0.1}
                  value={[parameters.std_dev || 2.0]}
                  onValueChange={(value) => handleParameterChange('std_dev', value[0])}
                />
                <span className="w-12 text-center">{parameters.std_dev || 2.0}</span>
              </div>
              <p className="text-sm text-muted-foreground">Standard deviation multiplier for bands</p>
            </div>
          </div>
        )
        
      case 'BREAKOUT':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lookback">Lookback Period</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="lookback"
                  min={5}
                  max={50}
                  step={1}
                  value={[parameters.lookback || 20]}
                  onValueChange={(value) => handleParameterChange('lookback', value[0])}
                />
                <span className="w-12 text-center">{parameters.lookback || 20}</span>
              </div>
              <p className="text-sm text-muted-foreground">Number of periods to look back for high/low calculation</p>
            </div>
          </div>
        )
        
      case 'TREND_FOLLOWING':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fast_period">Fast MA Period</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="fast_period"
                  min={3}
                  max={20}
                  step={1}
                  value={[parameters.fast_period || 9]}
                  onValueChange={(value) => handleParameterChange('fast_period', value[0])}
                />
                <span className="w-12 text-center">{parameters.fast_period || 9}</span>
              </div>
              <p className="text-sm text-muted-foreground">Fast moving average period</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slow_period">Slow MA Period</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="slow_period"
                  min={10}
                  max={50}
                  step={1}
                  value={[parameters.slow_period || 21]}
                  onValueChange={(value) => handleParameterChange('slow_period', value[0])}
                />
                <span className="w-12 text-center">{parameters.slow_period || 21}</span>
              </div>
              <p className="text-sm text-muted-foreground">Slow moving average period</p>
            </div>
          </div>
        )
        
      default:
        return (
          <div className="text-center py-4 text-muted-foreground">
            Select a strategy type to configure parameters
          </div>
        )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{existingStrategy ? 'Edit Strategy' : 'Create New Strategy'}</CardTitle>
        <CardDescription>
          Configure your trading strategy parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name</Label>
            <Input
              id="name"
              placeholder="My Trading Strategy"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your strategy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strategy_type">Strategy Type</Label>
            <Select
              value={strategyType}
              onValueChange={setStrategyType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select strategy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOMENTUM">Momentum</SelectItem>
                <SelectItem value="MEAN_REVERSION">Mean Reversion</SelectItem>
                <SelectItem value="BREAKOUT">Breakout</SelectItem>
                <SelectItem value="TREND_FOLLOWING">Trend Following</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Strategy Parameters</h3>
            {renderParameterInputs()}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is_active">Activate Strategy</Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onSave?.(null)}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : existingStrategy ? 'Update Strategy' : 'Create Strategy'}
        </Button>
      </CardFooter>
    </Card>
  )
}