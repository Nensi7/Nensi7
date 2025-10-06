"use client"

import { CheckCircle2, Copy, FileText, FileSpreadsheet } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ResultsDisplayProps {
  results: {
    title: string
    content: string
    metadata: Record<string, any>
  }
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(results.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = (format: string) => {
    // Simulate export
    alert(`Exporting as ${format}... In production, this would generate a ${format} file.`)
  }

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
              Confidence: {results.metadata.confidence}%
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
            {results.metadata.processingTime}
          </span>
        </div>
      </div>

      <Card className="p-6 bg-muted/50 border-l-4 border-l-primary">
        <div className="whitespace-pre-line leading-relaxed">{results.content}</div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        {Object.entries(results.metadata).map(([key, value]) => (
          <Card key={key} className="p-4 text-center bg-muted/30">
            <div className="font-bold text-lg">{value}</div>
            <div className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleExport("PDF")} variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Export PDF
        </Button>
        <Button onClick={() => handleExport("Word")} variant="outline" className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export Word
        </Button>
        <Button onClick={handleCopy} variant="outline" className="gap-2 bg-transparent">
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>
      </div>
    </div>
  )
}
