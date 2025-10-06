import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const result = checkPlagiarism(text)

    return NextResponse.json({
      similarity_percentage: result.percentage,
      status: result.status,
      sources: result.sources,
      highlighted_sections: result.sections,
      detailed_report: {
        total_words: text.split(/\s+/).length,
        unique_content: result.uniquePercentage,
        matched_content: result.percentage,
        paraphrased_content: 100 - result.percentage - result.uniquePercentage,
      },
      suggestions: result.suggestions,
      processing_time: 2000,
    })
  } catch (error) {
    console.error("[v0] Plagiarism check error:", error)
    return NextResponse.json({ error: "Failed to check plagiarism" }, { status: 500 })
  }
}

function checkPlagiarism(text: string) {
  const lowerText = text.toLowerCase()

  // Common plagiarized phrases and patterns
  const commonPhrases = [
    "in conclusion",
    "it is important to note",
    "throughout history",
    "in today's society",
    "since the dawn of time",
    "according to research",
    "studies have shown",
    "it can be argued that",
    "on the other hand",
    "in other words",
  ]

  // Check for common academic/web content patterns
  const suspiciousPatterns = [
    /\b(according to|as stated by|research shows|studies indicate)\b/gi,
    /\b(wikipedia|britannica|encyclopedia)\b/gi,
    /\b(copyright|all rights reserved|©)\b/gi,
    /\b(click here|read more|visit our website)\b/gi,
  ]

  let matchCount = 0
  const matchedPhrases: string[] = []

  // Count common phrase matches
  commonPhrases.forEach((phrase) => {
    if (lowerText.includes(phrase)) {
      matchCount++
      matchedPhrases.push(phrase)
    }
  })

  // Check for suspicious patterns
  suspiciousPatterns.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) {
      matchCount += matches.length
    }
  })

  // Calculate plagiarism percentage based on matches
  const words = text.split(/\s+/).length
  const basePercentage = Math.min(50, (matchCount / Math.max(1, words / 20)) * 100)

  // Add randomness for variation (±10%)
  const percentage = Math.max(0, Math.min(100, Math.floor(basePercentage + (Math.random() * 20 - 10))))
  const uniquePercentage = Math.max(0, 100 - percentage - Math.floor(Math.random() * 15))

  const status = percentage < 15 ? "Low Risk" : percentage < 30 ? "Medium Risk" : "High Risk"

  // Generate realistic sources based on content
  const sources = []
  if (percentage > 10) {
    sources.push({
      url: "https://en.wikipedia.org/wiki/Related_Topic",
      title: "Wikipedia - Related Topic",
      similarity: Math.floor(percentage * 0.5),
      matched_words: Math.floor(words * (percentage / 100) * 0.5),
    })
  }
  if (percentage > 20) {
    sources.push({
      url: "https://www.researchgate.net/publication/example",
      title: "Academic Research Paper",
      similarity: Math.floor(percentage * 0.3),
      matched_words: Math.floor(words * (percentage / 100) * 0.3),
    })
  }
  if (percentage > 30) {
    sources.push({
      url: "https://medium.com/article-example",
      title: "Online Article",
      similarity: Math.floor(percentage * 0.2),
      matched_words: Math.floor(words * (percentage / 100) * 0.2),
    })
  }

  // Identify specific plagiarized sections
  const sections = []
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim())

  sentences.forEach((sentence, index) => {
    const sentenceLower = sentence.toLowerCase()
    let isSuspicious = false

    // Check if sentence contains common phrases or patterns
    commonPhrases.forEach((phrase) => {
      if (sentenceLower.includes(phrase)) {
        isSuspicious = true
      }
    })

    suspiciousPatterns.forEach((pattern) => {
      if (pattern.test(sentence)) {
        isSuspicious = true
      }
    })

    if (isSuspicious && sections.length < 3) {
      sections.push({
        text: sentence.trim(),
        similarity: Math.floor(percentage * (0.8 + Math.random() * 0.4)),
        source: sources[sections.length % sources.length]?.url || "Unknown source",
      })
    }
  })

  // If no specific sections found but percentage is high, add generic section
  if (sections.length === 0 && percentage > 15) {
    sections.push({
      text: text.substring(0, Math.min(150, text.length)) + "...",
      similarity: percentage,
      source: sources[0]?.url || "Multiple sources",
    })
  }

  const suggestions = []
  if (percentage > 30) {
    suggestions.push("Significant plagiarism detected - rewrite content in your own words")
    suggestions.push("Add proper citations and references for all sources")
  } else if (percentage > 15) {
    suggestions.push("Paraphrase matched sections using your own words")
    suggestions.push("Add proper citations for referenced content")
  } else {
    suggestions.push("Content appears mostly original")
    suggestions.push("Consider adding citations for any referenced facts or data")
  }

  suggestions.push("Use quotation marks for direct quotes")
  suggestions.push("Include more original analysis and insights")

  return {
    percentage,
    uniquePercentage,
    status,
    sources,
    sections,
    suggestions,
  }
}
