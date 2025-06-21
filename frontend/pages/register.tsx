"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Heart, Sparkles, Star, Shield } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/contexts/theme-context"

interface RegisterProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Register({ currentPage, onPageChange }: RegisterProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { theme } = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Simulate registration process
    setTimeout(() => {
      if (formData.fullName && formData.email && formData.password) {
        localStorage.setItem("token", "demo-token")
        onPageChange("dashboard")
      } else {
        setError("Please fill in all fields")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-heroGradient)" }}>
      <Navigation currentPage={currentPage} onPageChange={onPageChange} />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/doctor-2.png"
                alt="Medical Professional"
                width={160}
                height={160}
                className="rounded-full shadow-2xl"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-foreground)" }}>
              Join MeddiSynx
            </h1>
            <p className="text-xl opacity-80" style={{ color: "var(--color-foreground)" }}>
              Create your account and start generating synthetic data
            </p>
          </div>

          {/* Register Card */}
          <Card
            className="shadow-2xl rounded-3xl border-0 overflow-hidden"
            style={{ background: "var(--color-cardGradient)" }}
          >
            <CardHeader className="text-center py-8" style={{ background: "var(--color-primaryGradient)" }}>
              <CardTitle className="text-2xl flex items-center justify-center" style={{ color: "white" }}>
                <UserPlus className="w-8 h-8 mr-3" />
                Create Account
              </CardTitle>
              <CardDescription className="opacity-90 text-lg" style={{ color: "white" }}>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-lg font-medium"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Full Name
                  </Label>
                  <div className="relative mt-3">
                    <User
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-12 py-4 text-lg rounded-2xl shadow-lg border-2 hover:scale-105 transition-all duration-200"
                      style={{
                        borderColor: "var(--color-border)",
                        background: "var(--color-card)",
                        color: "var(--color-foreground)",
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-lg font-medium" style={{ color: "var(--color-foreground)" }}>
                    Email Address
                  </Label>
                  <div className="relative mt-3">
                    <Mail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-12 py-4 text-lg rounded-2xl shadow-lg border-2 hover:scale-105 transition-all duration-200"
                      style={{
                        borderColor: "var(--color-border)",
                        background: "var(--color-card)",
                        color: "var(--color-foreground)",
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="text-lg font-medium"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Password
                  </Label>
                  <div className="relative mt-3">
                    <Lock
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-12 pr-12 py-4 text-lg rounded-2xl shadow-lg border-2 hover:scale-105 transition-all duration-200"
                      style={{
                        borderColor: "var(--color-border)",
                        background: "var(--color-card)",
                        color: "var(--color-foreground)",
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-all duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 opacity-50" style={{ color: "var(--color-primary)" }} />
                      ) : (
                        <Eye className="w-5 h-5 opacity-50" style={{ color: "var(--color-primary)" }} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-lg font-medium"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    Confirm Password
                  </Label>
                  <div className="relative mt-3">
                    <Lock
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-12 pr-12 py-4 text-lg rounded-2xl shadow-lg border-2 hover:scale-105 transition-all duration-200"
                      style={{
                        borderColor: "var(--color-border)",
                        background: "var(--color-card)",
                        color: "var(--color-foreground)",
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-all duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 opacity-50" style={{ color: "var(--color-primary)" }} />
                      ) : (
                        <Eye className="w-5 h-5 opacity-50" style={{ color: "var(--color-primary)" }} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <Card className="p-4 rounded-2xl border-0" style={{ background: "var(--color-muted)" }}>
                    <p className="text-center font-medium" style={{ color: "var(--color-secondary)" }}>
                      {error}
                    </p>
                  </Card>
                )}

                <Button
                  type="submit"
                  className="w-full py-6 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200 font-bold"
                  disabled={isLoading}
                  style={{
                    background: "var(--color-buttonGradient)",
                    color: "var(--color-buttonText)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-6 h-6 mr-3" />
                      Create Account
                    </>
                  )}
                </Button>

                <div className="text-center pt-6">
                  <p className="text-lg" style={{ color: "var(--color-foreground)" }}>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => onPageChange("login")}
                      className="font-bold hover:underline hover:scale-105 transition-all duration-200 inline-flex items-center"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Sign in here <Heart className="w-4 h-4 ml-1" />
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: Shield, text: "Privacy First" },
              { icon: Sparkles, text: "AI Powered" },
              { icon: Star, text: "Easy to Use" },
            ].map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card
                  key={index}
                  className="p-4 text-center rounded-2xl shadow-lg border-0 hover:scale-105 transition-all duration-200"
                  style={{ background: "var(--color-card)" }}
                >
                  <div
                    className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      background: index % 2 === 0 ? "var(--color-primaryGradient)" : "var(--color-accentGradient)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: index % 2 === 0 ? "white" : "var(--color-primary)" }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                    {benefit.text}
                  </p>
                </Card>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Card
              className="inline-block px-8 py-4 rounded-2xl shadow-lg border-0"
              style={{ background: "var(--color-card)" }}
            >
              <p className="text-sm opacity-60" style={{ color: "var(--color-foreground)" }}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
