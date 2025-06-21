"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import {
  Upload,
  Download,
  Play,
  BarChart3,
  FileText,
  Brain,
  Shield,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "@/contexts/theme-context"

interface GeneratorProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Generator({ currentPage, onPageChange }: GeneratorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedModel, setSelectedModel] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string[][] | null>(null)
  const [summary, setSummary] = useState<Record<string, any> | null>(null)
  const [metrics, setMetrics] = useState<Record<string, any> | null>(null)
  const [syntheticDataPath, setSyntheticDataPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (selectedFile) {
      const getPreview = async () => {
        const formData = new FormData()
        formData.append("file", selectedFile)

        try {
          const res = await fetch("http://localhost:8000/preprocess/", {
            method: "POST",
            body: formData,
          })

          if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`)
          }

          const data = await res.json()
          setPreview(data.preview)
          setSummary(data.summary)
          setError(null)
        } catch (err: any) {
          setError(err.message)
          setPreview(null)
          setSummary(null)
        }
      }
      getPreview()
    }
  }, [selectedFile])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleGenerate = async () => {
    if (!selectedFile || !selectedModel) {
      setError("Please select a file and a model.")
      return
    }

    setIsGenerating(true)
    setGenerationComplete(false)
    setError(null)
    setProgress(0)

    try {
      // Step 1: Generate synthetic data
      setProgress(10)
      const generateFormData = new FormData()
      generateFormData.append("file", selectedFile)
      generateFormData.append("model_name", selectedModel)

      const generateRes = await fetch("http://localhost:8000/generate/", {
        method: "POST",
        body: generateFormData,
      })
      setProgress(50)

      if (!generateRes.ok) throw new Error("Failed to generate data.")
      const generateData = await generateRes.json()
      setSyntheticDataPath(generateData.path)
      setProgress(60)

      // Step 2: Evaluate the data
      const evaluateFormData = new FormData()
      const syntheticFile = await fetch(`http://localhost:8000/download/${generateData.path}`).then((res) =>
        res.blob()
      )

      evaluateFormData.append("real", selectedFile)
      evaluateFormData.append(
        "synthetic",
        new File([syntheticFile], "synthetic_data.csv", { type: "text/csv" })
      )

      const evaluateRes = await fetch("http://localhost:8000/evaluate/", {
        method: "POST",
        body: evaluateFormData,
      })
      setProgress(90)

      if (!evaluateRes.ok) throw new Error("Failed to evaluate data.")
      const evaluateData = await evaluateRes.json()
      setMetrics(evaluateData)
      setProgress(100)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
      setGenerationComplete(true)
    }
  }

  const models = [
    {
      id: "dpgan",
      name: "DP-GAN",
      description: "Differential Privacy GAN with strong privacy guarantees",
      icon: Shield,
    },
    {
      id: "ctgan",
      name: "CT-GAN",
      description: "Conditional Tabular GAN for realistic data generation",
      icon: Brain,
    },
    {
      id: "privbayes",
      name: "PrivBayes",
      description: "Private Bayesian Network with formal privacy guarantees",
      icon: Sparkles,
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: "var(--color-heroGradient)" }}>
      <Navigation currentPage={currentPage} onPageChange={onPageChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-foreground)" }}>
            Synthetic Data Laboratory
          </h1>
          <p className="text-xl opacity-80 max-w-3xl mx-auto" style={{ color: "var(--color-foreground)" }}>
            Generate privacy-preserving synthetic healthcare data using advanced GANs with just a few clicks
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Generation Panel */}
          <div className="lg:col-span-3">
            <Card
              className="shadow-2xl rounded-3xl border-0 overflow-hidden"
              style={{ background: "var(--color-cardGradient)" }}
            >
              <CardHeader
                className="text-center py-8 animate-gradient"
                style={{ background: "var(--color-featureGradient)" }}
              >
                <CardTitle className="text-2xl text-white flex items-center justify-center">
                  <Sparkles className="w-8 h-8 mr-3" />
                  Data Generation Wizard
                </CardTitle>
                <CardDescription className="text-white opacity-90 text-lg">
                  Follow the steps below to create your synthetic dataset
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <Tabs defaultValue="upload" className="space-y-8">
                  <TabsList className="grid w-full grid-cols-4 rounded-2xl p-2 h-16">
                    <TabsTrigger value="upload" className="rounded-xl text-sm font-medium py-3">
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="configure" className="rounded-xl text-sm font-medium py-3">
                      Configure
                    </TabsTrigger>
                    <TabsTrigger value="generate" className="rounded-xl text-sm font-medium py-3">
                      Generate
                    </TabsTrigger>
                    <TabsTrigger value="results" className="rounded-xl text-sm font-medium py-3">
                      Results
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-6">
                    <div className="text-center">
                      <div
                        className="border-4 border-dashed rounded-3xl p-12 hover:scale-105 transition-all duration-300 cursor-pointer"
                        style={{ borderColor: "var(--color-primary)" }}
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Upload className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--color-primary)" }} />
                        <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--color-foreground)" }}>
                          Drop your CSV file here
                        </h3>
                        <p className="text-lg" style={{ color: "var(--color-mutedText)" }}>
                          Or click to browse your files
                        </p>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {selectedFile && (
                      <Card
                        className="p-6 rounded-2xl shadow-lg border-0"
                        style={{ background: "var(--color-accentGradient)" }}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ background: "var(--color-primaryGradient)" }}
                          >
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>
                              File Selected: {selectedFile.name}
                            </h3>
                            <p style={{ color: "var(--color-mutedText)" }}>
                              Size: {(selectedFile.size / 1024).toFixed(2)} KB • Ready to process
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}

                    <Card
                      className="rounded-2xl shadow-lg border-0"
                      style={{ background: "var(--color-accentGradient)" }}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center" style={{ color: "var(--color-foreground)" }}>
                          <FileText className="w-6 h-6 mr-2" />
                          Data Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Your CSV data preview will appear here..."
                          className="h-40 rounded-xl"
                          readOnly
                          value={
                            preview
                              ? preview.map((row) => row.join(",")).join("\n")
                              : "Your CSV data preview will appear here..."
                          }
                          style={{
                            background: "var(--color-input)",
                            color: "var(--color-foreground)",
                          }}
                        />
                      </CardContent>
                    </Card>

                    {summary && (
                      <Card
                        className="rounded-2xl shadow-lg border-0"
                        style={{ background: "var(--color-accentGradient)" }}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center" style={{ color: "var(--color-foreground)" }}>
                            <BarChart3 className="w-6 h-6 mr-2" />
                            Data Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr style={{ color: "var(--color-mutedText)" }}>
                                  {Object.keys(summary).map((col) => (
                                    <th key={col} className="p-2 text-left font-semibold">
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  {Object.keys(summary).map((col) => (
                                    <td key={col} className="p-2 align-top">
                                      <pre className="text-xs whitespace-pre-wrap">
                                        {Object.entries(summary[col])
                                          .map(([stat, value]) => `${stat}: ${value}`)
                                          .join("\n")}
                                      </pre>
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="configure" className="space-y-6">
                    <div className="grid gap-6">
                      <Card className="rounded-2xl shadow-lg border-0" style={{ background: "var(--color-card)" }}>
                        <CardHeader>
                          <CardTitle className="flex items-center" style={{ color: "var(--color-foreground)" }}>
                            <Brain className="w-6 h-6 mr-2" />
                            Choose Your AI Model
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            {models.map((model, index) => {
                              const Icon = model.icon
                              return (
                                <Card
                                  key={model.id}
                                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
                                    selectedModel === model.id ? "shadow-xl" : "shadow-lg"
                                  }`}
                                  style={{
                                    background:
                                      selectedModel === model.id
                                        ? index % 2 === 0
                                          ? "var(--color-accentGradient)"
                                          : "var(--color-mutedGradient)"
                                        : "var(--color-cardGradient)",
                                    borderColor:
                                      selectedModel === model.id ? "var(--color-primary)" : "var(--color-border)",
                                  }}
                                  onClick={() => setSelectedModel(model.id)}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div
                                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                                      style={{
                                        background:
                                          index % 2 === 0
                                            ? "var(--color-primaryGradient)"
                                            : "var(--color-accentGradient)",
                                      }}
                                    >
                                      <Icon
                                        className="w-6 h-6"
                                        style={{ color: index % 2 === 0 ? "white" : "var(--color-primary)" }}
                                      />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-lg" style={{ color: "var(--color-foreground)" }}>
                                        {model.name}
                                      </h3>
                                      <p style={{ color: "var(--color-mutedText)" }}>{model.description}</p>
                                    </div>
                                  </div>
                                </Card>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="rounded-2xl shadow-lg border-0" style={{ background: "var(--color-card)" }}>
                          <CardHeader>
                            <CardTitle style={{ color: "var(--color-foreground)" }}>Privacy Settings</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label style={{ color: "var(--color-foreground)" }}>Privacy Budget (ε)</Label>
                              <Input
                                type="number"
                                placeholder="1.0"
                                className="mt-2 rounded-xl"
                                style={{
                                  background: "var(--color-card)",
                                  color: "var(--color-foreground)",
                                  border: "1px solid var(--color-border)",
                                }}
                              />
                            </div>
                            <div>
                              <Label style={{ color: "var(--color-foreground)" }}>Number of Samples</Label>
                              <Input
                                type="number"
                                placeholder="1000"
                                className="mt-2 rounded-xl"
                                style={{
                                  background: "var(--color-card)",
                                  color: "var(--color-foreground)",
                                  border: "1px solid var(--color-border)",
                                }}
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-lg border-0" style={{ background: "var(--color-card)" }}>
                          <CardHeader>
                            <CardTitle style={{ color: "var(--color-foreground)" }}>Preprocessing</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {[
                              "Normalize numerical features",
                              "Handle missing values",
                              "Encode categorical variables",
                            ].map((option, index) => (
                              <label key={index} className="flex items-center space-x-3">
                                <input type="checkbox" className="rounded-lg w-5 h-5" />
                                <span style={{ color: "var(--color-foreground)" }}>{option}</span>
                              </label>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="generate" className="space-y-6">
                    <div className="text-center space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-foreground)" }}>
                          Ready to Generate Data?
                        </h3>
                        <p className="text-lg" style={{ color: "var(--color-mutedText)" }}>
                          Click the button below to start the synthetic data generation process
                        </p>
                      </div>

                      <Button
                        onClick={handleGenerate}
                        disabled={!selectedFile || !selectedModel || isGenerating}
                        size="lg"
                        className="px-12 py-6 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200 font-bold animate-gradient"
                        style={{
                          background: "var(--color-buttonGradient)",
                          color: "var(--color-buttonText)",
                        }}
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Play className="w-6 h-6 mr-3" />
                            Start Generation
                          </>
                        )}
                      </Button>

                      {isGenerating && (
                        <Card
                          className="p-8 rounded-2xl shadow-lg border-0 max-w-md mx-auto"
                          style={{ background: "var(--color-card)" }}
                        >
                          <div className="space-y-6">
                            <div className="text-center">
                              <h4 className="text-xl font-bold mb-2" style={{ color: "var(--color-foreground)" }}>
                                Training AI Model...
                              </h4>
                              <p style={{ color: "var(--color-mutedText)" }}>This may take a few minutes</p>
                            </div>
                            <Progress value={progress} className="h-4 rounded-full" />
                            <p className="text-center font-medium" style={{ color: "var(--color-primary)" }}>
                              {progress}% Complete
                            </p>
                          </div>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="results" className="space-y-6">
                    {generationComplete && metrics ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(metrics).map(([key, value]) => (
                          <Card key={key} className="rounded-2xl">
                            <CardHeader>
                              <CardTitle className="capitalize text-lg">{key.replace(/_/g, " ")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-3xl font-bold">{value !== null ? value.toFixed(3) : "N/A"}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Your generation results will appear here.</p>
                      </div>
                    )}
                    {syntheticDataPath && (
                      <div className="text-center mt-6">
                        <Button
                          onClick={() => {
                            window.location.href = `http://localhost:8000/download/${syntheticDataPath}`
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Synthetic Data
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            <Card
              className="rounded-2xl shadow-xl border-0 sticky top-24"
              style={{ background: "var(--color-sidebarGradient)" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: "var(--color-foreground)" }}>
                  <Brain className="w-6 h-6 mr-2" />
                  AI Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {models.map((model, index) => {
                  const Icon = model.icon
                  return (
                    <div key={model.id} className="flex items-start space-x-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                        style={{
                          background: index % 2 === 0 ? "var(--color-primaryGradient)" : "var(--color-accentGradient)",
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: index % 2 === 0 ? "white" : "var(--color-primary)" }}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: "var(--color-foreground)" }}>
                          {model.name}
                        </h4>
                        <p style={{ color: "var(--color-mutedText)" }}>{model.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card
              className="rounded-2xl shadow-xl border-0 relative z-10"
              style={{ background: "var(--color-mutedGradient)" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: "var(--color-foreground)" }}>
                  <Shield className="w-6 h-6 mr-2" />
                  Privacy Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm" style={{ color: "var(--color-foreground)" }}>
                  <li className="flex items-start space-x-2">
                    <span style={{ color: "var(--color-primary)" }}>•</span>
                    <span>Lower ε values = stronger privacy</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span style={{ color: "var(--color-primary)" }}>•</span>
                    <span>Recommended ε range: 0.1 - 10.0</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span style={{ color: "var(--color-primary)" }}>•</span>
                    <span>Larger datasets = better results</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span style={{ color: "var(--color-primary)" }}>•</span>
                    <span>Always validate synthetic data quality</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
