"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import {
  Shield,
  Database,
  Zap,
  Users,
  Lock,
  TrendingUp,
  Activity,
  Star,
  ArrowRight,
  UserPlus,
  LogIn,
} from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface DashboardProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Dashboard({ currentPage, onPageChange }: DashboardProps) {
  const features = [
    {
      icon: Shield,
      title: "Privacy-First",
      description: "Advanced differential privacy guarantees for all generated data",
    },
    {
      icon: Database,
      title: "EHR Ready",
      description: "Compatible with Electronic Health Records and medical imaging",
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "State-of-the-art GANs for high-quality synthetic data",
    },
    {
      icon: Users,
      title: "User-Friendly",
      description: "Intuitive interface designed for healthcare professionals",
    },
  ]

  const stats = [
    { label: "Data Points Generated", value: "2.8M+", icon: TrendingUp, gradient: "var(--color-primaryGradient)" },
    { label: "Privacy Guarantee", value: "ε=0.1", icon: Shield, gradient: "var(--color-secondaryGradient)" },
    { label: "Model Accuracy", value: "94.2%", icon: Activity, gradient: "var(--color-accentGradient)" },
    { label: "User Satisfaction", value: "4.9★", icon: Star, gradient: "var(--color-accentGradient)" },
  ]

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-heroGradient)" }}>
      <Navigation currentPage={currentPage} onPageChange={onPageChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/doctor-1.png"
              alt="Medical Professional"
              width={240}
              height={240}
              className="rounded-full shadow-2xl"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold" style={{ color: "var(--color-foreground)" }}>
              Welcome to <span className="gradient-text">MeddiSynx</span>
            </h1>

            <p className="text-2xl md:text-3xl font-medium opacity-80" style={{ color: "var(--color-foreground)" }}>
              Privacy-Preserving Synthetic Health Data Platform
            </p>

            <p className="text-lg max-w-4xl mx-auto opacity-70" style={{ color: "var(--color-mutedText)" }}>
              Generate high-quality synthetic Electronic Health Records and medical imaging data using state-of-the-art
              GANs with Differential Privacy. Unlock the power of healthcare data while maintaining patient
              confidentiality.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button
                onClick={() => onPageChange("generator")}
                size="lg"
                className="text-lg px-10 py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200 font-semibold"
                style={{
                  background: "var(--color-buttonGradient)",
                  color: "var(--color-buttonText)",
                }}
              >
                <Zap className="w-6 h-6 mr-3" />
                Start Creating Data
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => onPageChange("login")}
                size="lg"
                className="text-lg px-10 py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200 font-semibold"
                style={{
                  background: "var(--color-buttonGradient)",
                  color: "var(--color-buttonText)",
                }}
              >
                <Lock className="w-6 h-6 mr-3" />
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        <div className="mb-20">
          <Card
            className="max-w-2xl mx-auto text-center p-8 shadow-2xl rounded-3xl border-0"
            style={{ background: "var(--color-cardGradient)" }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-foreground)" }}>
              Ready to Get Started?
            </h2>
            <p className="text-lg opacity-80 mb-6" style={{ color: "var(--color-mutedText)" }}>
              Join thousands of researchers using MeddiSynx
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onPageChange("register")}
                size="lg"
                className="text-lg px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
                style={{
                  background: "var(--color-buttonGradient)",
                  color: "var(--color-buttonText)",
                }}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up Free
              </Button>
              <Button
                onClick={() => onPageChange("login")}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 font-semibold border-2"
                style={{
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                  background: "transparent",
                }}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </Button>
            </div>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const isUserSatisfaction = stat.label === "User Satisfaction"
            return (
              <Card
                key={index}
                className="text-center hover:scale-105 transition-all duration-300 shadow-xl rounded-3xl border-0 card-hover"
                style={{ background: "var(--color-statsGradient)" }}
              >
                <CardContent className="p-8">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg animate-gradient"
                    style={{ background: stat.gradient }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{
                        color: isUserSatisfaction && theme === "dark" ? "var(--color-pinkText)" : "white",
                      }}
                    />
                  </div>
                  <div className="text-4xl font-bold mb-2 gradient-text">{stat.value}</div>
                  <div className="text-sm font-medium opacity-70" style={{ color: "var(--color-mutedText)" }}>
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">Platform Features</h2>
          <p className="text-xl text-center mb-16 opacity-70" style={{ color: "var(--color-mutedText)" }}>
            Everything you need to generate synthetic healthcare data safely
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="text-center hover:scale-105 hover:rotate-1 transition-all duration-300 shadow-2xl rounded-3xl border-0 overflow-hidden card-hover"
                  style={{ background: "var(--color-featureGradient)" }}
                >
                  <CardHeader className="pb-4">
                    <div
                      className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl animate-gradient"
                      style={{ background: "var(--color-featureButtonGradient)" }}
                    >
                      <Icon className="w-10 h-10" style={{ color: "var(--color-featureButtonText)" }} />
                    </div>
                    <CardTitle className="text-xl" style={{ color: "var(--color-foreground)" }}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base" style={{ color: "var(--color-mutedText)" }}>
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* About Section */}
        <Card
          className="mb-20 shadow-2xl rounded-3xl border-0 overflow-hidden"
          style={{ background: "var(--color-mutedGradient)" }}
        >
          <CardContent className="p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 gradient-text">About MeddiSynx</h2>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--color-foreground)" }}>
                  Our platform revolutionizes healthcare data access by creating synthetic datasets that preserve
                  statistical properties while maintaining strict privacy standards. Using advanced Generative
                  Adversarial Networks with Differential Privacy, we enable breakthrough research without compromising
                  patient confidentiality.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg animate-gradient"
                      style={{ background: "var(--color-primaryGradient)" }}
                    >
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 gradient-text">Synthetic Data Generator</h3>
                      <p className="opacity-80" style={{ color: "var(--color-mutedText)" }}>
                        Generate EHR and medical imaging data with privacy guarantees
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg animate-gradient"
                      style={{ background: "var(--color-accentGradient)" }}
                    >
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 gradient-text">AI-Powered Analysis</h3>
                      <p className="opacity-80" style={{ color: "var(--color-mutedText)" }}>
                        Comprehensive quality evaluation and privacy metrics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/doctor-2.png"
                  alt="Medical Research"
                  width={300}
                  height={300}
                  className="rounded-full shadow-2xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card
            className="inline-block p-12 shadow-2xl rounded-3xl border-0 animate-gradient"
            style={{ background: "var(--color-secondaryGradient)" }}
          >
            <h3 className="text-3xl font-bold mb-4 text-slate-500">Ready to Get Started?</h3>
            <p className="text-xl opacity-90 mb-8 font-semibold text-gray-600">
              Join thousands of researchers using MeddiSynx for privacy-preserving data generation
            </p>
            <Button
              onClick={() => onPageChange("register")}
              size="lg"
              className="text-lg px-10 py-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
              style={{
                background: "var(--color-buttonGradient)",
                color: "var(--color-buttonText)",
              }}
            >
              <UserPlus className="w-6 h-6 mr-3" />
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
