"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Crown, Zap, Shield, Star } from "lucide-react"

interface SubscriptionPlansProps {
  currentTier: string
  onUpgrade: (tier: string) => void
}

export function SubscriptionPlans({ currentTier, onUpgrade }: SubscriptionPlansProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Free",
      icon: <Zap className="h-6 w-6" />,
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started with algorithmic trading",
      features: [
        "Paper trading only",
        "2 basic strategies",
        "1 exchange connection",
        "Basic market data",
        "Email support",
        "Community access",
      ],
      limitations: ["No live trading", "Limited to 10 trades/day", "Basic technical indicators only"],
      popular: false,
      color: "border-slate-600",
    },
    {
      id: "pro",
      name: "Pro",
      icon: <Star className="h-6 w-6" />,
      price: { monthly: 49, annual: 490 },
      description: "Advanced features for serious traders",
      features: [
        "Live trading enabled",
        "Unlimited strategies",
        "5 exchange connections",
        "Real-time market data",
        "Advanced technical indicators",
        "Portfolio rebalancing",
        "SMS alerts",
        "Priority support",
        "Custom strategy builder",
        "Backtesting engine",
      ],
      limitations: ["Up to $50K portfolio value", "Standard data feeds only"],
      popular: true,
      color: "border-purple-500",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: <Crown className="h-6 w-6" />,
      price: { monthly: 199, annual: 1990 },
      description: "Professional-grade trading infrastructure",
      features: [
        "Everything in Pro",
        "Unlimited portfolio value",
        "All exchange connections",
        "Premium data feeds",
        "Custom indicators",
        "API access",
        "Webhook notifications",
        "White-label options",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced risk management",
        "Institutional-grade security",
      ],
      limitations: [],
      popular: false,
      color: "border-yellow-500",
    },
  ]

  const handleUpgrade = (planId: string) => {
    // In a real app, this would integrate with Stripe or another payment processor
    onUpgrade(planId)
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm ${!isAnnual ? "text-white" : "text-slate-400"}`}>Monthly</span>
        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
        <span className={`text-sm ${isAnnual ? "text-white" : "text-slate-400"}`}>
          Annual
          <Badge variant="outline" className="ml-2 text-green-400 border-green-400">
            Save 17%
          </Badge>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`bg-slate-800 ${plan.color} ${plan.popular ? "ring-2 ring-purple-500" : ""} relative`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div
                  className={`p-3 rounded-full ${
                    plan.id === "free" ? "bg-slate-700" : plan.id === "pro" ? "bg-purple-600" : "bg-yellow-600"
                  }`}
                >
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-slate-400">{plan.description}</CardDescription>

              <div className="py-4">
                <div className="text-4xl font-bold text-white">
                  ${isAnnual ? plan.price.annual : plan.price.monthly}
                  {plan.price.monthly > 0 && (
                    <span className="text-lg text-slate-400">/{isAnnual ? "year" : "month"}</span>
                  )}
                </div>
                {isAnnual && plan.price.monthly > 0 && (
                  <div className="text-sm text-slate-400">
                    ${(plan.price.annual / 12).toFixed(0)}/month billed annually
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Features included:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-400">Limitations:</h4>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-4 h-4 border border-slate-500 rounded flex-shrink-0" />
                      <span className="text-slate-400 text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              <Button
                className={`w-full ${
                  currentTier === plan.id
                    ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                    : plan.id === "pro"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : plan.id === "enterprise"
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-slate-600 hover:bg-slate-700"
                }`}
                disabled={currentTier === plan.id}
                onClick={() => handleUpgrade(plan.id)}
              >
                {currentTier === plan.id ? (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Current Plan
                  </>
                ) : plan.id === "free" ? (
                  "Get Started"
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Feature Comparison</CardTitle>
          <CardDescription className="text-slate-400">Compare all features across our plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 text-white">Feature</th>
                  <th className="text-center py-3 text-white">Free</th>
                  <th className="text-center py-3 text-white">Pro</th>
                  <th className="text-center py-3 text-white">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-700">
                  <td className="py-3 text-slate-300">Live Trading</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3">✅</td>
                  <td className="text-center py-3">✅</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 text-slate-300">Number of Strategies</td>
                  <td className="text-center py-3 text-slate-400">2</td>
                  <td className="text-center py-3 text-white">Unlimited</td>
                  <td className="text-center py-3 text-white">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 text-slate-300">Exchange Connections</td>
                  <td className="text-center py-3 text-slate-400">1</td>
                  <td className="text-center py-3 text-white">5</td>
                  <td className="text-center py-3 text-white">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 text-slate-300">Portfolio Value Limit</td>
                  <td className="text-center py-3 text-slate-400">Paper only</td>
                  <td className="text-center py-3 text-white">$50K</td>
                  <td className="text-center py-3 text-white">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 text-slate-300">Custom Indicators</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3">✅</td>
                  <td className="text-center py-3">✅</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 text-slate-300">API Access</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3">✅</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 text-slate-300">Support Level</td>
                  <td className="text-center py-3 text-slate-400">Email</td>
                  <td className="text-center py-3 text-white">Priority</td>
                  <td className="text-center py-3 text-white">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Can I change plans anytime?</h4>
            <p className="text-slate-400 text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
              prorate any billing differences.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Is there a free trial for paid plans?</h4>
            <p className="text-slate-400 text-sm">
              We offer a 14-day free trial for both Pro and Enterprise plans. No credit card required to start your
              trial.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">What happens to my strategies if I downgrade?</h4>
            <p className="text-slate-400 text-sm">
              Your strategies will be preserved, but some advanced features may be disabled. You can always upgrade
              again to restore full functionality.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Do you offer refunds?</h4>
            <p className="text-slate-400 text-sm">
              We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support
              team for a full refund.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
