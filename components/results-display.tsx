"use client"

import { CheckCircle2, Copy, FileText, FileSpreadsheet, Download, Save, ExternalLink, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { exportToPDF, exportToWord, exportToText, exportToJSON } from "@/lib/export-utils"
import { saveToHistory } from "@/lib/history-storage"
import { useAuth } from "@/lib/auth-context"

interface ResultsDisplayProps {
  results: {
    title: string
    content: string
    metadata: Record<string, any>
  }
  moduleType?: string
  inputText?: string
  rawData?: any // Added rawData prop to access original API response
}

export function ResultsDisplay({ results, moduleType, inputText, rawData }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const { user } = useAuth()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(results.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = (format: "pdf" | "word" | "text" | "json") => {
    switch (format) {
      case "pdf":
        exportToPDF(results.title, results.content, results.metadata)
        break
      case "word":
        exportToWord(results.title, results.content, results.metadata)
        break
      case "text":
        exportToText(results.title, results.content, results.metadata)
        break
      case "json":
        exportToJSON(results.title, results.content, results.metadata)
        break
    }
  }

  const handleSaveToHistory = () => {
    if (!user) {
      alert("Please log in to save to history")
      return
    }

    saveToHistory({
      userId: user.id,
      moduleType: moduleType || "unknown",
      inputText: inputText || "",
      results,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const isToolRecommendation = moduleType === "problem-solver" && rawData?.solutions?.[0]?.features

  return (
    <div className="mt-8 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-success" />
          <h3 className="text-xl font-bold">{results.title}</h3>
        </div>

        <div className="flex gap-2">
          {results.metadata.confidence && (
            <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
              Confidence: {results.metadata.confidence}
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
            {results.metadata.processingTime}
          </span>
        </div>
      </div>

      {isToolRecommendation ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Sparkles className="w-5 h-5" />
            <p>Here are the best AI tools for your needs:</p>
          </div>

          {rawData.solutions.map((tool: any, index: number) => (
            <Card
              key={index}
              className="p-6 bg-gradient-to-br from-card to-muted/30 border-l-4 border-l-primary hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-primary mb-2">{tool.title}</h4>
                    {tool.confidence && (
                      <span className="inline-block px-2 py-1 rounded text-xs bg-success/20 text-success">
                        {Math.round(tool.confidence * 100)}% Match
                      </span>
                    )}
                  </div>
                  {tool.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={() => window.open(tool.website, "_blank")}
                    >
                      Visit Site
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed">{tool.description}</p>

                {tool.features && (
                  <div>
                    <h5 className="font-semibold mb-2 text-sm uppercase tracking-wide">Key Features</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tool.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tool.use_cases && (
                  <div>
                    <h5 className="font-semibold mb-2 text-sm uppercase tracking-wide">Best For</h5>
                    <div className="flex flex-wrap gap-2">
                      {tool.use_cases.map((useCase: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tool.website && (
                  <div className="pt-2 border-t border-border">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {tool.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {rawData.follow_up && rawData.follow_up.length > 0 && (
            <Card className="p-4 bg-muted/50">
              <h5 className="font-semibold mb-2">Follow-up Questions:</h5>
              <ul className="space-y-1">
                {rawData.follow_up.map((question: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {question}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-6 bg-muted/50 border-l-4 border-l-primary">
          <div className="whitespace-pre-line leading-relaxed">{results.content}</div>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        {Object.entries(results.metadata).map(([key, value]) => (
          <Card key={key} className="p-4 text-center bg-muted/30">
            <div className="font-bold text-lg">{value}</div>
            <div className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("word")}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export as Word
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("text")}>
              <FileText className="w-4 h-4 mr-2" />
              Export as Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>
              <FileText className="w-4 h-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleCopy} variant="outline" className="gap-2 bg-transparent">
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>

        <Button onClick={handleSaveToHistory} variant="outline" className="gap-2 bg-transparent" disabled={!user}>
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save to History"}
        </Button>
      </div>
    </div>
  )
}
