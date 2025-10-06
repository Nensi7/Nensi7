"use client"

import { useState } from "react"
import { Lightbulb, Edit3, Search, Heading, Play, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResultsDisplay } from "@/components/results-display"

const modules = [
  {
    id: "problem-solver",
    name: "AI Problem Solver",
    description: "Get intelligent solutions and suggestions for any issue",
    icon: Lightbulb,
  },
  {
    id: "text-enhancement",
    name: "Text Enhancement",
    description: "Improve grammar, style, and reduce plagiarism",
    icon: Edit3,
  },
  {
    id: "plagiarism-check",
    name: "Plagiarism Check",
    description: "Detect originality and check for copied content",
    icon: Search,
  },
  {
    id: "title-generator",
    name: "Title Generator",
    description: "Generate compelling titles for research and content",
    icon: Heading,
  },
]

interface ProcessingSectionProps {
  inputText: string
}

export function ProcessingSection({ inputText }: ProcessingSectionProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleProcess = async () => {
    if (!selectedModule || !inputText.trim()) {
      setError("Please provide input text before processing")
      return
    }

    setIsProcessing(true)
    setResults(null)
    setError(null)

    try {
      const apiEndpoints: Record<string, string> = {
        "problem-solver": "/api/nlp/problem-solver",
        "text-enhancement": "/api/nlp/text-enhancement",
        "plagiarism-check": "/api/nlp/plagiarism-check",
        "title-generator": "/api/nlp/title-generator",
      }

      const endpoint = apiEndpoints[selectedModule]

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          category: "auto",
          options: {},
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()

      const formattedResults = formatResults(selectedModule, data)
      setResults(formattedResults)
    } catch (err) {
      console.error("[v0] Processing error:", err)
      setError(err instanceof Error ? err.message : "Failed to process. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatResults = (moduleId: string, data: any) => {
    switch (moduleId) {
      case "problem-solver":
        return {
          title: "AI Problem Analysis & Solutions",
          content: formatProblemSolverResults(data),
          metadata: {
            confidence: `${Math.round(data.confidence * 100)}%`,
            category: data.category,
            processingTime: `${(data.processing_time / 1000).toFixed(1)}s`,
            solutions: data.solutions.length,
          },
          rawData: data, // Pass raw data for special rendering
        }

      case "text-enhancement":
        return {
          title: "Enhanced Text Output",
          content: formatTextEnhancementResults(data),
          metadata: {
            readabilityImprovement: `${Math.round(data.readability_score.enhanced - data.readability_score.original)}%`,
            improvements: data.improvements.length,
            processingTime: `${(data.processing_time / 1000).toFixed(1)}s`,
          },
          rawData: data, // Pass raw data for special rendering
        }

      case "plagiarism-check":
        return {
          title: "Plagiarism Analysis Report",
          content: formatPlagiarismResults(data),
          metadata: {
            uniqueness: `${100 - data.similarity_percentage}%`,
            status: data.status,
            sourcesFound: data.sources.length,
            processingTime: `${(data.processing_time / 1000).toFixed(1)}s`,
          },
          rawData: data, // Pass raw data for special rendering
        }

      case "title-generator":
        return {
          title: "Generated Titles",
          content: formatTitleGeneratorResults(data),
          metadata: {
            titlesGenerated: data.titles.length,
            keywords: data.keywords.length,
            field: data.field,
            processingTime: `${(data.processing_time / 1000).toFixed(1)}s`,
          },
          rawData: data, // Pass raw data for special rendering
        }

      default:
        return {
          title: "Results",
          content: JSON.stringify(data, null, 2),
          metadata: {},
          rawData: data, // Pass raw data for special rendering
        }
    }
  }

  const formatProblemSolverResults = (data: any) => {
    let content = `Category: ${data.category}\n\n`

    data.solutions.forEach((solution: any, index: number) => {
      content += `${index + 1}. ${solution.title}\n`
      content += `${"=".repeat(solution.title.length + 3)}\n\n`

      if (solution.confidence) {
        content += `Confidence: ${Math.round(solution.confidence * 100)}%\n\n`
      }

      content += `${solution.description}\n\n`

      // Check if this is a tool recommendation (has features/website) or general solution (has steps)
      if (solution.features) {
        // Tool recommendation format
        content += `Key Features:\n`
        solution.features.forEach((feature: string) => {
          content += `  • ${feature}\n`
        })
        content += `\n`

        if (solution.use_cases) {
          content += `Best For:\n`
          solution.use_cases.forEach((useCase: string) => {
            content += `  • ${useCase}\n`
          })
          content += `\n`
        }

        if (solution.website) {
          content += `Website: ${solution.website}\n\n`
        }
      } else if (solution.steps) {
        // General solution format
        content += `Steps:\n`
        solution.steps.forEach((step: string, i: number) => {
          content += `  ${i + 1}. ${step}\n`
        })
        content += `\n`

        if (solution.resources) {
          content += `Resources:\n`
          solution.resources.forEach((resource: string) => {
            content += `  • ${resource}\n`
          })
          content += `\n`
        }
      }

      content += `\n`
    })

    if (data.follow_up && data.follow_up.length > 0) {
      content += `Follow-up Questions:\n`
      data.follow_up.forEach((question: string) => {
        content += `• ${question}\n`
      })
    }

    return content
  }

  const formatTextEnhancementResults = (data: any) => {
    let content = `Original Text:\n${data.original}\n\n`
    content += `Enhanced Text:\n${data.enhanced}\n\n`
    content += `Improvements Made:\n`
    data.improvements.forEach((improvement: string) => {
      content += `• ${improvement}\n`
    })
    content += `\nReadability Scores:\n`
    content += `• Original: ${Math.round(data.readability_score.original)}/100\n`
    content += `• Enhanced: ${Math.round(data.readability_score.enhanced)}/100\n`

    if (data.suggestions && data.suggestions.length > 0) {
      content += `\nAdditional Suggestions:\n`
      data.suggestions.forEach((suggestion: string) => {
        content += `• ${suggestion}\n`
      })
    }

    return content
  }

  const formatPlagiarismResults = (data: any) => {
    let content = `Overall Similarity: ${data.similarity_percentage}%\n`
    content += `Status: ${data.status}\n\n`
    content += `Detailed Report:\n`
    content += `• Total Words: ${data.detailed_report.total_words}\n`
    content += `• Unique Content: ${data.detailed_report.unique_content}%\n`
    content += `• Matched Content: ${data.detailed_report.matched_content}%\n`
    content += `• Paraphrased Content: ${data.detailed_report.paraphrased_content}%\n\n`

    if (data.sources && data.sources.length > 0) {
      content += `Sources Found:\n`
      data.sources.forEach((source: any, index: number) => {
        content += `${index + 1}. ${source.title}\n`
        content += `   URL: ${source.url}\n`
        content += `   Similarity: ${source.similarity}%\n`
        content += `   Matched Words: ${source.matched_words}\n\n`
      })
    }

    if (data.suggestions && data.suggestions.length > 0) {
      content += `Recommendations:\n`
      data.suggestions.forEach((suggestion: string) => {
        content += `• ${suggestion}\n`
      })
    }

    return content
  }

  const formatTitleGeneratorResults = (data: any) => {
    let content = `Keywords Extracted: ${data.keywords.join(", ")}\n\n`
    content += `Generated Titles:\n\n`

    data.titles.forEach((title: any, index: number) => {
      content += `${index + 1}. ${title.title}\n`
      content += `   Type: ${title.type}\n`
      content += `   Score: ${Math.round(title.score * 100)}%\n`
      content += `   Rationale: ${title.rationale}\n\n`
    })

    return content
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose Processing Module</h2>
        <p className="text-muted-foreground">Select an AI-powered module to process your content</p>
      </div>

      {error && <Card className="p-4 mb-4 bg-destructive/10 border-destructive text-destructive">{error}</Card>}

      {!inputText.trim() && (
        <Card className="p-4 mb-4 bg-warning/10 border-warning/50 text-warning">
          Please provide input text using one of the methods above before processing.
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {modules.map((module) => {
          const Icon = module.icon
          const isSelected = selectedModule === module.id

          return (
            <Card
              key={module.id}
              onClick={() => setSelectedModule(module.id)}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                isSelected
                  ? "bg-gradient-to-br from-primary to-accent text-white border-primary glow"
                  : "bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-white/20" : "bg-primary/10"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-primary"}`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{module.name}</h3>
                  <p className={`text-xs ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                    {module.description}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Button
        onClick={handleProcess}
        disabled={!selectedModule || isProcessing || !inputText.trim()}
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 glow"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : selectedModule ? (
          <>
            <Play className="w-5 h-5 mr-2" />
            Process with {modules.find((m) => m.id === selectedModule)?.name}
          </>
        ) : (
          "Select a module to continue"
        )}
      </Button>

      {results && (
        <ResultsDisplay
          results={results}
          moduleType={selectedModule || undefined}
          inputText={inputText}
          rawData={results.rawData} // Pass rawData to ResultsDisplay
        />
      )}
    </Card>
  )
}
