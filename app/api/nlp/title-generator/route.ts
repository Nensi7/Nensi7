import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, field, style } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate titles
    const titles = generateTitles(text, field, style)

    return NextResponse.json({
      titles,
      keywords: extractKeywords(text),
      field: field || "General",
      processing_time: 1000,
    })
  } catch (error) {
    console.error("[v0] Title generator error:", error)
    return NextResponse.json({ error: "Failed to generate titles" }, { status: 500 })
  }
}

function generateTitles(text: string, field?: string, style?: string) {
  const keywords = extractKeywords(text)
  const mainKeyword = keywords[0] || "Research"

  return [
    {
      title: `${mainKeyword}: A Comprehensive Analysis and Review`,
      type: "Descriptive",
      score: 0.92,
      rationale: "Clear, descriptive title that indicates comprehensive coverage",
    },
    {
      title: `How Does ${mainKeyword} Impact Modern Practices?`,
      type: "Question-based",
      score: 0.88,
      rationale: "Engaging question format that draws reader interest",
    },
    {
      title: `Exploring ${mainKeyword}: Methods, Results, and Implications`,
      type: "Methodology-focused",
      score: 0.85,
      rationale: "Highlights research approach and outcomes",
    },
    {
      title: `The Role of ${mainKeyword} in Contemporary Studies`,
      type: "Results-oriented",
      score: 0.83,
      rationale: "Emphasizes findings and relevance",
    },
    {
      title: `${mainKeyword} Unveiled: New Perspectives and Insights`,
      type: "Creative",
      score: 0.8,
      rationale: "Memorable and engaging while maintaining academic tone",
    },
  ]
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction (mock)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4)

  // Get unique words and return top 5
  const uniqueWords = [...new Set(words)]
  return uniqueWords.slice(0, 5).map((word) => word.charAt(0).toUpperCase() + word.slice(1))
}
