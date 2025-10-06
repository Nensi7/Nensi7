import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, category, context } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const detectedCategory = category || detectCategory(text)
    const isToolQuery = detectToolQuery(text)

    let solutions
    if (isToolQuery) {
      solutions = generateToolRecommendations(text)
    } else {
      solutions = generateGeneralSolutions(text, detectedCategory)
    }

    return NextResponse.json({
      solutions,
      confidence: 0.92,
      category: detectedCategory,
      follow_up: isToolQuery
        ? [
            "Would you like more details about any of these tools?",
            "Do you need help choosing the best tool for your needs?",
            "Would you like tutorials or guides for these tools?",
          ]
        : [
            "Would you like more details on any specific step?",
            "Do you need help implementing this solution?",
            "Are there any constraints I should consider?",
          ],
      processing_time: 1500,
    })
  } catch (error) {
    console.error("[v0] Problem solver error:", error)
    return NextResponse.json({ error: "Failed to process problem" }, { status: 500 })
  }
}

function detectToolQuery(text: string): boolean {
  const lowerText = text.toLowerCase()
  const toolKeywords = [
    "tool",
    "software",
    "app",
    "application",
    "platform",
    "service",
    "what ai",
    "which ai",
    "recommend",
    "suggestion",
    "best for",
    "diagram",
    "chart",
    "visualization",
    "design",
    "create",
    "generate",
  ]

  return toolKeywords.some((keyword) => lowerText.includes(keyword))
}

function generateToolRecommendations(text: string): any[] {
  const lowerText = text.toLowerCase()
  const solutions = []

  // Diagram and visualization tools
  if (lowerText.includes("diagram") || lowerText.includes("flowchart") || lowerText.includes("visualization")) {
    solutions.push({
      title: "Napkin AI",
      description:
        "Transform text into beautiful visual diagrams automatically using AI. Perfect for creating flowcharts, mind maps, and conceptual diagrams from written descriptions.",
      features: [
        "AI-powered text-to-diagram conversion",
        "Multiple diagram styles (flowcharts, mind maps, timelines)",
        "Real-time collaboration features",
        "Export to various formats (PNG, SVG, PDF)",
      ],
      use_cases: ["Business presentations", "Educational content", "Documentation"],
      website: "https://napkin.ai",
      confidence: 0.95,
    })

    solutions.push({
      title: "Mermaid Live Editor",
      description:
        "Create diagrams and visualizations using simple text-based syntax. Great for developers and technical documentation.",
      features: [
        "Text-based diagram creation",
        "Supports flowcharts, sequence diagrams, Gantt charts",
        "GitHub integration",
        "Free and open-source",
      ],
      use_cases: ["Technical documentation", "Software architecture", "Project planning"],
      website: "https://mermaid.live",
      confidence: 0.92,
    })

    solutions.push({
      title: "Whimsical",
      description: "Collaborative workspace for creating flowcharts, wireframes, and mind maps with AI assistance.",
      features: [
        "AI-powered diagram suggestions",
        "Real-time collaboration",
        "Templates library",
        "Integration with popular tools",
      ],
      use_cases: ["Product design", "Team brainstorming", "Process mapping"],
      website: "https://whimsical.com",
      confidence: 0.88,
    })
  }

  // Image generation tools
  if (
    lowerText.includes("image") ||
    lowerText.includes("picture") ||
    lowerText.includes("photo") ||
    lowerText.includes("art")
  ) {
    solutions.push({
      title: "Midjourney",
      description:
        "Leading AI image generation tool that creates stunning, high-quality images from text descriptions.",
      features: [
        "Photorealistic and artistic image generation",
        "Advanced style controls",
        "Community gallery for inspiration",
        "Multiple aspect ratios and variations",
      ],
      use_cases: ["Marketing materials", "Concept art", "Social media content"],
      website: "https://midjourney.com",
      confidence: 0.96,
    })

    solutions.push({
      title: "DALL-E 3",
      description: "OpenAI's powerful image generation model with excellent text understanding and safety features.",
      features: [
        "Accurate text-to-image generation",
        "Built-in safety filters",
        "High-resolution outputs",
        "Integrated with ChatGPT",
      ],
      use_cases: ["Creative projects", "Illustrations", "Product mockups"],
      website: "https://openai.com/dall-e-3",
      confidence: 0.94,
    })

    solutions.push({
      title: "Leonardo AI",
      description: "AI art generator with fine-tuned control over style, composition, and quality.",
      features: [
        "Multiple AI models for different styles",
        "Canvas editor for refinements",
        "Consistent character generation",
        "Free tier available",
      ],
      use_cases: ["Game assets", "Character design", "Marketing visuals"],
      website: "https://leonardo.ai",
      confidence: 0.9,
    })
  }

  // Video creation tools
  if (lowerText.includes("video") || lowerText.includes("animation") || lowerText.includes("motion")) {
    solutions.push({
      title: "Runway ML",
      description: "AI-powered video editing and generation platform with text-to-video capabilities.",
      features: [
        "Text-to-video generation",
        "AI video editing tools",
        "Green screen and background removal",
        "Motion tracking",
      ],
      use_cases: ["Content creation", "Film production", "Social media videos"],
      website: "https://runwayml.com",
      confidence: 0.93,
    })

    solutions.push({
      title: "Synthesia",
      description: "Create professional videos with AI avatars from text scripts.",
      features: ["AI avatar presenters", "Multi-language support", "Custom avatar creation", "Template library"],
      use_cases: ["Training videos", "Marketing content", "Presentations"],
      website: "https://synthesia.io",
      confidence: 0.91,
    })
  }

  // Writing and content tools
  if (
    lowerText.includes("writing") ||
    lowerText.includes("content") ||
    lowerText.includes("text") ||
    lowerText.includes("article")
  ) {
    solutions.push({
      title: "Jasper AI",
      description: "AI writing assistant for creating marketing copy, blog posts, and business content.",
      features: ["Multiple content templates", "Brand voice customization", "SEO optimization", "Team collaboration"],
      use_cases: ["Marketing copy", "Blog posts", "Social media content"],
      website: "https://jasper.ai",
      confidence: 0.92,
    })

    solutions.push({
      title: "Copy.ai",
      description: "AI-powered copywriting tool for creating engaging marketing and sales content.",
      features: ["90+ copywriting templates", "Multi-language support", "Tone adjustment", "Free plan available"],
      use_cases: ["Ad copy", "Product descriptions", "Email campaigns"],
      website: "https://copy.ai",
      confidence: 0.89,
    })
  }

  // Design tools
  if (
    lowerText.includes("design") ||
    lowerText.includes("ui") ||
    lowerText.includes("ux") ||
    lowerText.includes("interface")
  ) {
    solutions.push({
      title: "Uizard",
      description: "AI-powered design tool that transforms sketches and text into UI designs.",
      features: [
        "Text-to-UI generation",
        "Screenshot to design conversion",
        "Collaborative design workspace",
        "Design system generation",
      ],
      use_cases: ["App design", "Website mockups", "Rapid prototyping"],
      website: "https://uizard.io",
      confidence: 0.9,
    })

    solutions.push({
      title: "Figma AI",
      description: "Industry-standard design tool with AI-powered features for faster workflows.",
      features: [
        "AI-powered design suggestions",
        "Auto-layout and components",
        "Real-time collaboration",
        "Extensive plugin ecosystem",
      ],
      use_cases: ["UI/UX design", "Prototyping", "Design systems"],
      website: "https://figma.com",
      confidence: 0.94,
    })
  }

  // Code and development tools
  if (
    lowerText.includes("code") ||
    lowerText.includes("programming") ||
    lowerText.includes("development") ||
    lowerText.includes("developer")
  ) {
    solutions.push({
      title: "GitHub Copilot",
      description: "AI pair programmer that helps you write code faster with intelligent suggestions.",
      features: [
        "Context-aware code completion",
        "Multi-language support",
        "Code explanation and documentation",
        "IDE integration",
      ],
      use_cases: ["Software development", "Code learning", "Debugging"],
      website: "https://github.com/features/copilot",
      confidence: 0.96,
    })

    solutions.push({
      title: "Cursor",
      description: "AI-first code editor built for pair programming with AI.",
      features: ["Natural language code editing", "Codebase understanding", "Multi-file editing", "Built on VS Code"],
      use_cases: ["Full-stack development", "Code refactoring", "Learning to code"],
      website: "https://cursor.sh",
      confidence: 0.93,
    })
  }

  // If no specific tools matched, provide general AI tools
  if (solutions.length === 0) {
    solutions.push({
      title: "ChatGPT",
      description: "Versatile AI assistant for answering questions, writing, analysis, and problem-solving.",
      features: [
        "Natural language understanding",
        "Multi-domain knowledge",
        "Code generation and debugging",
        "Creative writing assistance",
      ],
      use_cases: ["General assistance", "Research", "Content creation", "Learning"],
      website: "https://chat.openai.com",
      confidence: 0.95,
    })

    solutions.push({
      title: "Claude",
      description: "Advanced AI assistant with strong reasoning and analysis capabilities.",
      features: [
        "Long-context understanding",
        "Detailed analysis and reasoning",
        "Code and writing assistance",
        "Ethical AI design",
      ],
      use_cases: ["Complex problem-solving", "Document analysis", "Research"],
      website: "https://claude.ai",
      confidence: 0.93,
    })

    solutions.push({
      title: "Perplexity AI",
      description: "AI-powered search engine that provides cited answers with sources.",
      features: ["Real-time web search", "Source citations", "Follow-up questions", "Academic mode"],
      use_cases: ["Research", "Fact-checking", "Learning"],
      website: "https://perplexity.ai",
      confidence: 0.91,
    })
  }

  return solutions
}

function generateGeneralSolutions(text: string, category: string): any[] {
  return [
    {
      title: "Primary Solution",
      description: `Based on your ${category.toLowerCase()} query: "${text.substring(0, 100)}${text.length > 100 ? "..." : ""}", here's a comprehensive solution approach.`,
      steps: [
        "Analyze the core issue and identify key components",
        "Research best practices and proven methodologies",
        "Implement a systematic approach with clear milestones",
        "Test and validate the solution iteratively",
        "Document the process for future reference",
      ],
      confidence: 0.92,
      resources: ["Related documentation and guides", "Community forums and discussions", "Expert recommendations"],
    },
    {
      title: "Alternative Approach",
      description: "Consider this complementary strategy for additional perspective.",
      steps: [
        "Evaluate alternative methodologies",
        "Compare trade-offs and benefits",
        "Implement hybrid solution if needed",
      ],
      confidence: 0.85,
      resources: ["Case studies", "Comparative analysis"],
    },
  ]
}

function detectCategory(text: string): string {
  const lowerText = text.toLowerCase()

  if (lowerText.includes("code") || lowerText.includes("programming") || lowerText.includes("bug")) {
    return "Technical"
  } else if (lowerText.includes("research") || lowerText.includes("study") || lowerText.includes("academic")) {
    return "Academic"
  } else if (lowerText.includes("business") || lowerText.includes("marketing") || lowerText.includes("sales")) {
    return "Business"
  } else {
    return "General"
  }
}
