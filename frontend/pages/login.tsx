"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { LogIn, Mail, Lock, Eye, EyeOff, Heart, Sparkles } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/contexts/theme-context"

interface LoginProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Login({ currentPage, onPageChange }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { theme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate login process
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("token", "demo-token")
        onPageChange("dashboard")
      } else {
        setError("Please enter valid credentials")
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
                src="/images/doctor-1.png"
                alt="Medical Professional"
                width={160}
                height={160}
                className="rounded-full shadow-2xl"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-foreground)" }}>
              Welcome Back
            </h1>
            <p className="text-xl opacity-80" style={{ color: "var(--color-foreground)" }}>
              Sign in to your MeddiSynx account and continue your data journey
            </p>
          </div>

          {/* Login Card */}
          <Card
            className="shadow-2xl rounded-3xl border-0 overflow-hidden"
            style={{ background: "var(--color-cardGradient)" }}
          >
            <CardHeader className="text-center py-8" style={{ background: "var(--color-primaryGradient)" }}>
              <CardTitle className="text-2xl flex items-center justify-center" style={{ color: "white" }}>
                <LogIn className="w-8 h-8 mr-3" />
                Sign In
              </CardTitle>
              <CardDescription className="opacity-90 text-lg" style={{ color: "white" }}>
                Enter your credentials to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-6 h-6 mr-3" />
                      Sign In
                    </>
                  )}
                </Button>

                <div className="text-center pt-6">
                  <p className="text-lg" style={{ color: "var(--color-foreground)" }}>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => onPageChange("register")}
                      className="font-bold hover:underline hover:scale-105 transition-all duration-200 inline-flex items-center"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Sign up here <Heart className="w-4 h-4 ml-1" />
                    </button>
                  </p>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="text-base hover:underline hover:scale-105 transition-all duration-200 inline-flex items-center"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Forgot your password?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Card
              className="inline-block px-8 py-4 rounded-2xl shadow-lg border-0"
              style={{ background: "var(--color-card)" }}
            >
              <p className="text-sm opacity-60" style={{ color: "var(--color-foreground)" }}>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
