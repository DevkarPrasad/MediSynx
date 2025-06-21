"use client"

import { useState } from "react"
import { ThemeProvider } from "@/contexts/theme-context"
import Dashboard from "@/pages/dashboard"
import Generator from "@/pages/generator"
import Login from "@/pages/login"
import Register from "@/pages/register"
import SyntheticPage from "@/pages/synthetic-page"

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    const pageProps = {
      currentPage,
      onPageChange: setCurrentPage,
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard {...pageProps} />
      case "generator":
        return <Generator {...pageProps} />
      case "login":
        return <Login {...pageProps} />
      case "register":
        return <Register {...pageProps} />
      case "synthetic":
        return <SyntheticPage {...pageProps} />
      default:
        return <Dashboard {...pageProps} />
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen">{renderPage()}</div>
    </ThemeProvider>
  )
}
