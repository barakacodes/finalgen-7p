"use client"

import { Users, Star, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  const handleNavigation = (page: string) => {
    alert(`Navigate to ${page} page`)
  }

  const features = [
    {
      icon: "📊",
      title: "Automated Trading",
      description: "Advanced algorithms execute trades 24/7 while you sleep",
    },
    {
      icon: "📈",
      title: "Smart Strategies",
      description: "Pre-built strategies optimized for maximum profitability",
    },
    {
      icon: "🛡️",
      title: "Risk Management",
      description: "Built-in safety features to protect your investments",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Execute trades in milliseconds with our optimized engine",
    },
  ]

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Crypto Trader",
      content: "Increased my trading profits by 300% in just 2 months!",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Investment Manager",
      content: "The best automated trading platform I've ever used.",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Day Trader",
      content: "Finally, a platform that actually works as advertised.",
      rating: 5,
    },
  ]

  const stats = [
    { label: "Active Users", value: "50,000+" },
    { label: "Total Trades", value: "10M+" },
    { label: "Success Rate", value: "87%" },
    { label: "Avg. Monthly ROI", value: "23%" },
  ]

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)",
    color: "white",
    fontFamily: "Arial, sans-serif",
  }

  const headerStyle = {
    padding: "1rem 2rem",
  }

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }

  const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  }

  const logoStyle = {
    padding: "0.5rem",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    borderRadius: "0.5rem",
    position: "relative" as const,
  }

  const logoIconStyle = {
    width: "2rem",
    height: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.25rem",
  }

  const indicatorStyle = {
    position: "absolute" as const,
    top: "-0.25rem",
    right: "-0.25rem",
    width: "0.75rem",
    height: "0.75rem",
    background: "#10b981",
    borderRadius: "50%",
  }

  const buttonStyle = {
    background: "#7c3aed",
    border: "none",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "1rem",
  }

  const ghostButtonStyle = {
    background: "transparent",
    border: "none",
    color: "white",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontSize: "1rem",
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <nav style={navStyle}>
          <div style={logoContainerStyle}>
            <div style={logoStyle}>
              <div style={logoIconStyle}>
                X<div style={indicatorStyle}></div>
              </div>
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Crypto X</span>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button style={ghostButtonStyle} onClick={() => handleNavigation("Login")}>
              Login
            </button>
            <button style={buttonStyle} onClick={() => handleNavigation("Signup")}>
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(124, 58, 237, 0.2)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              borderRadius: "9999px",
              padding: "0.5rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
            }}
          >
            🚀 Now Supporting 15+ Exchanges
          </div>

          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              lineHeight: "1.1",
            }}
          >
            Trade Crypto Like a{" "}
            <span
              style={{
                background: "linear-gradient(to right, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pro
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              color: "#cbd5e1",
              marginBottom: "2rem",
              maxWidth: "42rem",
              margin: "0 auto 2rem",
            }}
          >
            Our advanced AI-powered trading platform executes profitable trades automatically, so you can earn while you
            sleep. Join thousands of successful traders.
          </p>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                width: "20rem",
                padding: "0.75rem",
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "0.375rem",
                color: "white",
                fontSize: "1rem",
              }}
            />
            <button
              style={{
                background: "#7c3aed",
                border: "none",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1rem",
              }}
              onClick={() => handleNavigation("Signup")}
            >
              Start Trading
              <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#94a3b8" }}
          >
            <CheckCircle size={16} color="#10b981" />
            <span>Free 7-day trial • No credit card required</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "4rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            maxWidth: "64rem",
            margin: "0 auto",
          }}
        >
          {stats.map((stat, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{stat.value}</div>
              <div style={{ color: "#94a3b8" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Why Choose Crypto X?</h2>
            <p style={{ fontSize: "1.25rem", color: "#cbd5e1", maxWidth: "42rem", margin: "0 auto" }}>
              Built by traders, for traders. Our platform combines cutting-edge technology with proven trading
              strategies.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid #475569",
                  borderRadius: "0.5rem",
                  padding: "2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>{feature.title}</h3>
                <p style={{ color: "#cbd5e1" }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Trusted by Thousands</h2>
            <p style={{ fontSize: "1.25rem", color: "#cbd5e1" }}>See what our users are saying about their success</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid #475569",
                  borderRadius: "0.5rem",
                  padding: "2rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p style={{ color: "#cbd5e1", fontSize: "1.125rem", marginBottom: "1.5rem" }}>
                  "{testimonial.content}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      background: "#7c3aed",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Users size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{testimonial.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(to right, #7c3aed, #ec4899)",
              borderRadius: "0.5rem",
              padding: "3rem",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Ready to Start Trading?</h2>
            <p
              style={{
                fontSize: "1.25rem",
                color: "#e9d5ff",
                marginBottom: "2rem",
                maxWidth: "42rem",
                margin: "0 auto 2rem",
              }}
            >
              Join thousands of successful traders who are already using our platform to generate passive income.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                style={{
                  background: "white",
                  color: "#7c3aed",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1rem",
                }}
                onClick={() => handleNavigation("Signup")}
              >
                Start Free Trial
                <ArrowRight size={16} />
              </button>
              <button
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
                onClick={() => handleNavigation("Pricing")}
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "3rem 2rem", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={logoStyle}>
                  <div
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    X
                    <div
                      style={{
                        position: "absolute",
                        top: "-0.125rem",
                        right: "-0.125rem",
                        width: "0.5rem",
                        height: "0.5rem",
                        background: "#10b981",
                        borderRadius: "50%",
                      }}
                    ></div>
                  </div>
                </div>
                <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Crypto X</span>
              </div>
              <p style={{ color: "#94a3b8" }}>The most advanced cryptocurrency trading platform.</p>
            </div>

            <div>
              <h3 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Product</h3>
              <ul style={{ listStyle: "none", color: "#94a3b8", padding: 0 }}>
                <li style={{ marginBottom: "0.5rem", cursor: "pointer" }} onClick={() => handleNavigation("Features")}>
                  Features
                </li>
                <li style={{ marginBottom: "0.5rem", cursor: "pointer" }} onClick={() => handleNavigation("Pricing")}>
                  Pricing
                </li>
                <li style={{ marginBottom: "0.5rem", cursor: "pointer" }} onClick={() => handleNavigation("API")}>
                  API
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Support</h3>
              <ul style={{ listStyle: "none", color: "#94a3b8", padding: 0 }}>
                <li
                  style={{ marginBottom: "0.5rem", cursor: "pointer" }}
                  onClick={() => handleNavigation("Documentation")}
                >
                  Documentation
                </li>
                <li style={{ marginBottom: "0.5rem", cursor: "pointer" }} onClick={() => handleNavigation("Help")}>
                  Help Center
                </li>
                <li style={{ marginBottom: "0.5rem", cursor: "pointer" }} onClick={() => handleNavigation("Contact")}>
                  Contact
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Company</h3>
              <ul style={{ listStyle: "none", color: "#94a3b8", padding: 0 }}>
                <li style={{ marginBottom: "0.5rem", cursor: "pointer" }} onClick={() => handleNavigation("About")}>
                  About
                </li>
                <li style={{ marginBottom: "0.5rem", cursor: "pointer" }} onClick={() => handleNavigation("Blog")}>
                  Blog
                </li>
                <li style={{ marginBottom: "0.5rem", cursor: "pointer" }} onClick={() => handleNavigation("Careers")}>
                  Careers
                </li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: "center", color: "#94a3b8", paddingTop: "2rem", borderTop: "1px solid #1e293b" }}>
            <p>&copy; 2024 Crypto X. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
