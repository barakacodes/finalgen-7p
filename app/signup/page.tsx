"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, User, ArrowLeft, CheckCircle, Shield, Zap } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Redirect to dashboard or verification page
      alert("Account created successfully!")
    } catch (error) {
      console.error("Signup failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    "7-day free trial",
    "No credit card required",
    "24/7 customer support",
    "Advanced trading strategies",
    "Real-time market data",
    "Risk management tools",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
              <div className="relative">
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">X</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">Crypto X</span>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:text-purple-300"
            onClick={() => alert("Navigate to Home")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <div>
              <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-500/30">
                🚀 Join 50,000+ Traders
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Start Your Trading
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {" "}
                  Journey
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Create your account and start earning with our advanced AI-powered trading platform.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">What you get:</h3>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">87%</div>
                <div className="text-slate-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">23%</div>
                <div className="text-slate-400">Avg Monthly ROI</div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Create Your Account</CardTitle>
                <CardDescription className="text-slate-300">Get started with your free trial today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">
                        First Name
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                            errors.firstName ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-white">
                        Last Name
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                            errors.lastName ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email Address
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <Label htmlFor="agreeToTerms" className="text-slate-300 cursor-pointer">
                          I agree to the{" "}
                          <button className="text-purple-400 hover:text-purple-300">Terms of Service</button> and{" "}
                          <button className="text-purple-400 hover:text-purple-300">Privacy Policy</button>
                        </Label>
                        {errors.agreeToTerms && <p className="text-red-400 text-sm mt-1">{errors.agreeToTerms}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                      />
                      <Label htmlFor="subscribeNewsletter" className="text-slate-300 cursor-pointer text-sm">
                        Subscribe to our newsletter for trading tips and updates
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Start Free Trial
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-slate-400">
                      Already have an account?{" "}
                      <button
                        className="text-purple-400 hover:text-purple-300"
                        onClick={() => alert("Navigate to Login")}
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Your data is secure</p>
                  <p className="text-slate-400 text-sm">We use bank-level encryption to protect your information</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
