"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { Sun, Moon, Menu, X, Home, Zap, Bell } from 'lucide-react'

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "dashboard", label: "Dashboard", icon: Home },
    { href: "generator", label: "Data Lab", icon: Zap },
  ]

  const handleNavClick = (page: string) => {
    onPageChange(page)
    setIsMenuOpen(false)
  }

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-lg border-b border-opacity-20 shadow-lg"
      style={{
        background: "var(--color-cardGradient)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button onClick={() => handleNavClick("dashboard")} className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
              style={{
                background: "var(--color-primaryGradient)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-400">
                {/* Simple heart without medical cross */}
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-2xl" style={{ color: "var(--color-foreground)" }}>
                MeddiSynx
              </span>
              <p className="text-sm opacity-70" style={{ color: "var(--color-foreground)" }}>
                Synthetic Health Data
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Main Navigation */}
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.href
              return (
                <Button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  variant="ghost"
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 ${
                    isActive ? "shadow-lg" : ""
                  }`}
                  style={
                    isActive
                      ? {
                          background: "var(--color-primaryGradient)",
                          color: "white",
                        }
                      : {
                          color: "var(--color-foreground)",
                        }
                  }
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              )
            })}

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl w-12 h-12 hover:scale-105 transition-all duration-200 ml-2"
              style={{ color: "var(--color-foreground)" }}
            >
              <Bell className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-2xl w-12 h-12 hover:scale-105 transition-all duration-200 shadow-lg"
              style={{
                background: "var(--color-accentGradient)",
                color: "var(--color-foreground)",
              }}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-2xl"
              style={{ color: "var(--color-foreground)" }}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-2xl"
              style={{ color: "var(--color-foreground)" }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-opacity-20" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.href
                return (
                  <Button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    variant="ghost"
                    className={`w-full justify-start flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-200 ${
                      isActive ? "shadow-lg" : ""
                    }`}
                    style={
                      isActive
                        ? {
                            background: "var(--color-primaryGradient)",
                            color: "white",
                          }
                        : {
                            color: "var(--color-foreground)",
                          }
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
