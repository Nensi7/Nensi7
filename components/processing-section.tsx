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

export function ProcessingSection() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleProcess = async () => {
    if (!selectedModule) return

    setIsProcessing(true)
    setResults(null)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock results based on module
    const mockResults = {
      "problem-solver": {
        title: "AI Problem Analysis & Solutions",
        content:
          "Based on your input, I've identified several key areas that need attention:\n\n• Root Cause Analysis: Break down the problem into smaller, manageable components\n• Strategic Planning: Develop a step-by-step action plan with clear milestones\n• Resource Optimization: Identify and leverage available resources effectively\n• Risk Mitigation: Anticipate potential challenges and prepare contingency plans\n\nNext Steps:\n• Prioritize actions based on impact and feasibility\n• Set realistic timelines for implementation\n• Monitor progress and adjust strategy as needed",
        metadata: {
          confidence: 92,
          processingTime: "2.3s",
          wordCount: 150,
        },
      },
      "text-enhancement": {
        title: "Enhanced Text Output",
        content:
          "Your text has been enhanced with the following improvements:\n\n• Grammar and punctuation corrections\n• Vocabulary enhancement for better clarity\n• Sentence structure optimization\n• Tone and style adjustments\n• Reduced redundancy and improved flow\n\nQuality Metrics:\n• Readability Score: Improved by 23%\n• Grammar Accuracy: 98%\n• Style Consistency: Excellent",
        metadata: {
          confidence: 88,
          processingTime: "1.8s",
          improvements: 12,
        },
      },
      "plagiarism-check": {
        title: "Plagiarism Analysis Report",
        content:
          "Overall Uniqueness: 94%\n\nDetailed Results:\n• Original Content: 94%\n• Potentially Similar Content: 6%\n• Sources Found: 3\n• Academic Database Matches: 1\n• Web Content Matches: 2\n\nRisk Assessment: LOW RISK\n\nRecommendations:\n• Review highlighted sections for proper citations\n• Consider paraphrasing similar content\n• Add original analysis and insights",
        metadata: {
          confidence: 95,
          processingTime: "3.1s",
          uniqueness: "94%",
        },
      },
      "title-generator": {
        title: "Generated Titles",
        content:
          'Descriptive Titles:\n• "Understanding Innovation: A Comprehensive Analysis"\n• "The Impact of Technology on Modern Business"\n\nQuestion-Based Titles:\n• "How Does Innovation Affect Business Growth?"\n• "What Makes Technology Essential for Success?"\n\nAction-Oriented Titles:\n• "Implementing Innovation Solutions for Growth"\n• "Transforming Business Through Technology"\n\nCreative Titles:\n• "Beyond Innovation: Rethinking Business"\n• "The Technology Revolution: A New Perspective"',
        metadata: {
          confidence: 89,
          processingTime: "1.5s",
          titlesGenerated: 8,
        },
      },
    }

    setResults(mockResults[selectedModule as keyof typeof mockResults])
    setIsProcessing(false)
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose Processing Module</h2>
        <p className="text-muted-foreground">Select an AI-powered module to process your content</p>
      </div>

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
        disabled={!selectedModule || isProcessing}
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

      {results && <ResultsDisplay results={results} />}
    </Card>
  )
}
