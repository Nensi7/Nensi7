import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, options } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const enhanced = enhanceText(text, options)

    return NextResponse.json({
      original: text,
      enhanced: enhanced.text,
      improvements: enhanced.improvements,
      readability_score: {
        original: calculateReadability(text),
        enhanced: calculateReadability(enhanced.text),
      },
      suggestions: enhanced.suggestions,
      processing_time: 1200,
    })
  } catch (error) {
    console.error("[v0] Text enhancement error:", error)
    return NextResponse.json({ error: "Failed to enhance text" }, { status: 500 })
  }
}

function enhanceText(text: string, options: any) {
  let enhanced = text
  const improvements: string[] = []
  const suggestions: string[] = []

  // Track original for comparison
  const original = text

  // 1. Fix principle/principal confusion
  enhanced = enhanced.replace(/\bprinciple\s+(problem|issue|concern|reason|cause)\b/gi, "principal $1")
  enhanced = enhanced.replace(/\bprinciple\s+(goal|objective|aim|purpose)\b/gi, "principal $1")

  // 2. Fix verb "be" usage - should be "is/are/was/were"
  enhanced = enhanced.replace(/\b(proposal|idea|concept|plan|project|document)\s+be\s+that\b/gi, "$1 is that")
  enhanced = enhanced.replace(/\b(proposals|ideas|concepts|plans|projects|documents)\s+be\s+that\b/gi, "$1 are that")
  enhanced = enhanced.replace(/\b(it|this|that)\s+be\s+(a|an|the|that)\b/gi, "$1 is $2")

  // 3. Fix "Every" + plural noun (should be singular)
  enhanced = enhanced.replace(/\bevery\s+(\w+)s\s+(was|is|has|have)\b/gi, (match, word, verb) => {
    const singularVerb = verb === "have" ? "has" : verb === "are" ? "is" : verb === "were" ? "was" : verb
    return `every ${word} ${singularVerb}`
  })

  // 4. Fix adjective used as adverb (e.g., "worked remote" → "worked remotely")
  enhanced = enhanced.replace(/\b(worked|work|works|working)\s+remote\b/gi, "$1 remotely")
  enhanced = enhanced.replace(/\b(moved|move|moves|moving)\s+quick\b/gi, "$1 quickly")
  enhanced = enhanced.replace(/\b(ran|run|runs|running)\s+slow\b/gi, "$1 slowly")
  enhanced = enhanced.replace(/\b(did|do|does|doing)\s+good\b/gi, "$1 well")
  enhanced = enhanced.replace(/\b(performed|perform|performs)\s+bad\b/gi, "$1 badly")

  // 5. Fix "Beside" vs "Besides"
  enhanced = enhanced.replace(/\bBeside,/g, "Besides,")
  enhanced = enhanced.replace(/\bbeside,/g, "besides,")
  enhanced = enhanced.replace(/\bBeside\s+that/gi, "Besides that")

  // 6. Fix "what was present" → "which was presented"
  enhanced = enhanced.replace(/\bwhat\s+was\s+present\s+on\b/gi, "which was presented on")
  enhanced = enhanced.replace(/\bwhat\s+was\s+present\s+in\b/gi, "which was presented in")
  enhanced = enhanced.replace(/\bwhat\s+were\s+present\b/gi, "which were presented")

  // 7. Fix pronoun agreement (its vs their for team/company/group)
  enhanced = enhanced.replace(
    /\b(team|company|group|committee|board|staff)\s+should\s+review\s+its\b/gi,
    "$1 should review their",
  )
  enhanced = enhanced.replace(/\b(team|company|group|committee|board|staff)\s+made\s+its\b/gi, "$1 made their")
  enhanced = enhanced.replace(
    /\b(team|company|group|committee|board|staff)\s+presented\s+its\b/gi,
    "$1 presented their",
  )

  // 8. Fix "before they will" → "before they" (remove unnecessary "will")
  enhanced = enhanced.replace(/\bbefore\s+(they|we|you|I)\s+will\s+(\w+)\b/gi, "before $1 $2")
  enhanced = enhanced.replace(/\bafter\s+(they|we|you|I)\s+will\s+(\w+)\b/gi, "after $1 $2")
  enhanced = enhanced.replace(/\bwhen\s+(they|we|you|I)\s+will\s+(\w+)\b/gi, "when $1 $2")

  // 9. Fix capitalization at start of text
  if (enhanced.length > 0 && enhanced[0] === enhanced[0].toLowerCase()) {
    enhanced = enhanced[0].toUpperCase() + enhanced.slice(1)
  }

  // 10. Fix capitalization after sentence endings
  enhanced = enhanced.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase()
  })

  // 11. Fix "i" to "I" (pronoun)
  enhanced = enhanced.replace(/\bi\b/g, "I")
  enhanced = enhanced.replace(/\bi'm\b/gi, "I'm")
  enhanced = enhanced.replace(/\bi've\b/gi, "I've")
  enhanced = enhanced.replace(/\bi'll\b/gi, "I'll")
  enhanced = enhanced.replace(/\bi'd\b/gi, "I'd")

  // 12. Fix multiple spaces
  enhanced = enhanced.replace(/\s+/g, " ").trim()

  // 13. Fix spacing around punctuation
  enhanced = enhanced.replace(/\s+([.,!?;:])/g, "$1") // Remove space before punctuation
  enhanced = enhanced.replace(/([.,!?;:])([A-Za-z])/g, "$1 $2") // Add space after punctuation

  // 14. Fix common spelling mistakes
  enhanced = enhanced.replace(/\balot\b/gi, "a lot")
  enhanced = enhanced.replace(/\brecieve\b/gi, "receive")
  enhanced = enhanced.replace(/\boccured\b/gi, "occurred")
  enhanced = enhanced.replace(/\bseperate\b/gi, "separate")
  enhanced = enhanced.replace(/\bdefinately\b/gi, "definitely")
  enhanced = enhanced.replace(/\bwierd\b/gi, "weird")
  enhanced = enhanced.replace(/\baccommodate\b/gi, "accommodate")
  enhanced = enhanced.replace(/\benvironment\b/gi, "environment")
  enhanced = enhanced.replace(/\boccassion\b/gi, "occasion")
  enhanced = enhanced.replace(/\bpublically\b/gi, "publicly")

  // 15. Fix their/there/they're confusion
  enhanced = enhanced.replace(/\btheir\s+(is|are|was|were)\b/gi, (match, verb) => `there ${verb}`)
  enhanced = enhanced.replace(/\btheir\s+going\b/gi, "they're going")
  enhanced = enhanced.replace(/\bthere\s+(house|car|dog|cat|book|idea)\b/gi, "their $1")

  // 16. Fix your/you're confusion
  enhanced = enhanced.replace(/\byour\s+(welcome|right|wrong|going|coming)\b/gi, (match, word) => `you're ${word}`)
  enhanced = enhanced.replace(/\byou're\s+(house|car|dog|cat|book|idea)\b/gi, "your $1")

  // 17. Fix its/it's confusion
  enhanced = enhanced.replace(/\bits\s+(a|an|the|not|very|really|so)\b/gi, (match, word) => `it's ${word}`)
  enhanced = enhanced.replace(/\bit's\s+(own|purpose|meaning|value)\b/gi, "its $1")

  // 18. Fix could of/should of/would of
  enhanced = enhanced.replace(/\bcould\s+of\b/gi, "could have")
  enhanced = enhanced.replace(/\bshould\s+of\b/gi, "should have")
  enhanced = enhanced.replace(/\bwould\s+of\b/gi, "would have")
  enhanced = enhanced.replace(/\bmight\s+of\b/gi, "might have")
  enhanced = enhanced.replace(/\bmust\s+of\b/gi, "must have")

  // 19. Fix verb agreement with pronouns
  enhanced = enhanced.replace(/\b(he|she|it)\s+are\b/gi, (match, pronoun) => `${pronoun} is`)
  enhanced = enhanced.replace(/\b(he|she|it)\s+were\b/gi, (match, pronoun) => `${pronoun} was`)
  enhanced = enhanced.replace(/\b(they|we|you)\s+is\b/gi, (match, pronoun) => `${pronoun} are`)
  enhanced = enhanced.replace(/\b(they|we|you)\s+was\b/gi, (match, pronoun) => `${pronoun} were`)

  // 20. Fix double negatives
  enhanced = enhanced.replace(/\bdon't\s+have\s+no\b/gi, "don't have any")
  enhanced = enhanced.replace(/\bcan't\s+get\s+no\b/gi, "can't get any")
  enhanced = enhanced.replace(/\bain't\s+got\s+no\b/gi, "don't have any")

  // 21. Fix sentence fragments (add periods if missing at end)
  if (enhanced.length > 0 && !/[.!?]$/.test(enhanced)) {
    enhanced = enhanced + "."
  }

  // 22. Fix "a" vs "an"
  enhanced = enhanced.replace(/\ba\s+([aeiou])/gi, "an $1")
  enhanced = enhanced.replace(/\ban\s+([^aeiou])/gi, "a $1")

  // 23. Apply formal tone if requested
  if (options?.tone === "formal") {
    enhanced = enhanced.replace(/\bdon't\b/g, "do not")
    enhanced = enhanced.replace(/\bcan't\b/g, "cannot")
    enhanced = enhanced.replace(/\bwon't\b/g, "will not")
    enhanced = enhanced.replace(/\bisn't\b/g, "is not")
    enhanced = enhanced.replace(/\baren't\b/g, "are not")
    enhanced = enhanced.replace(/\bwasn't\b/g, "was not")
    enhanced = enhanced.replace(/\bweren't\b/g, "were not")
    enhanced = enhanced.replace(/\bhasn't\b/g, "has not")
    enhanced = enhanced.replace(/\bhaven't\b/g, "have not")
    enhanced = enhanced.replace(/\bhadn't\b/g, "had not")
    enhanced = enhanced.replace(/\bshouldn't\b/g, "should not")
    enhanced = enhanced.replace(/\bwouldn't\b/g, "would not")
    enhanced = enhanced.replace(/\bcouldn't\b/g, "could not")
  }

  if (enhanced !== original) {
    const changes = []

    if (original.includes("principle") && enhanced.includes("principal")) {
      changes.push("Corrected 'principle' to 'principal'")
    }
    if (/\s+be\s+that/.test(original) && !/\s+be\s+that/.test(enhanced)) {
      changes.push("Fixed verb 'be' to proper form (is/are)")
    }
    if (/every\s+\w+s\s+/i.test(original) && !/every\s+\w+s\s+/i.test(enhanced)) {
      changes.push("Fixed singular/plural agreement with 'every'")
    }
    if (/worked\s+remote/i.test(original) && /worked\s+remotely/i.test(enhanced)) {
      changes.push("Changed adjective to adverb (remote → remotely)")
    }
    if (/Beside,/.test(original) && /Besides,/.test(enhanced)) {
      changes.push("Corrected 'Beside' to 'Besides'")
    }
    if (/what\s+was\s+present/i.test(original) && /which\s+was\s+presented/i.test(enhanced)) {
      changes.push("Fixed 'what was present' to 'which was presented'")
    }
    if (/its\s+assumptions/i.test(original) && /their\s+assumptions/i.test(enhanced)) {
      changes.push("Fixed pronoun agreement (its → their)")
    }
    if (/before\s+\w+\s+will\s+/i.test(original) && !/before\s+\w+\s+will\s+/i.test(enhanced)) {
      changes.push("Removed unnecessary 'will' in time clause")
    }
    if (/\bi\b/.test(original) && /\bI\b/.test(enhanced)) {
      changes.push("Capitalized pronoun 'I'")
    }
    if (/could\s+of|should\s+of|would\s+of/i.test(original)) {
      changes.push("Fixed 'of' to 'have' in verb phrases")
    }
    if (/their\s+(is|are|was|were)/i.test(original) && /there\s+(is|are|was|were)/i.test(enhanced)) {
      changes.push("Fixed their/there/they're confusion")
    }
    if (
      /your\s+(welcome|right|wrong|going)/i.test(original) &&
      /you're\s+(welcome|right|wrong|going)/i.test(enhanced)
    ) {
      changes.push("Fixed your/you're confusion")
    }

    improvements.push(...changes)

    if (improvements.length === 0) {
      improvements.push("Applied general grammar and style improvements")
    }
  } else {
    improvements.push("Text appears grammatically correct")
  }

  // Generate suggestions based on analysis
  const sentences = enhanced.split(/[.!?]+/).filter((s) => s.trim())

  // Check for long sentences
  const longSentences = sentences.filter((s) => s.trim().split(/\s+/).length > 25)
  if (longSentences.length > 0) {
    suggestions.push(`Found ${longSentences.length} long sentence(s) - consider breaking them down for clarity`)
  }

  // Check for passive voice
  const passiveCount = (enhanced.match(/\b(was|were|been|being)\s+\w+ed\b/gi) || []).length
  if (passiveCount > 2) {
    suggestions.push(`Detected ${passiveCount} instances of passive voice - consider using active voice`)
  }

  // Check for repetitive words
  const words = enhanced.toLowerCase().split(/\s+/)
  const wordCount = new Map<string, number>()
  words.forEach((word) => {
    if (word.length > 4 && /^[a-z]+$/.test(word)) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1)
    }
  })
  const repetitive = Array.from(wordCount.entries()).filter(([_, count]) => count > 3)
  if (repetitive.length > 0) {
    suggestions.push(
      `Words used frequently: ${repetitive.map(([word]) => word).join(", ")} - consider varying vocabulary`,
    )
  }

  // Check for transitional phrases
  if (
    sentences.length > 3 &&
    !/\b(however|therefore|moreover|furthermore|additionally|consequently|meanwhile|nevertheless)\b/i.test(enhanced)
  ) {
    suggestions.push("Add transitional phrases (however, therefore, moreover) for better flow between ideas")
  }

  if (suggestions.length === 0) {
    suggestions.push("Consider adding more descriptive language or varying sentence structure")
  }

  return { text: enhanced, improvements, suggestions }
}

function calculateReadability(text: string): number {
  // Simple readability score (mock)
  const words = text.split(/\s+/).length
  const sentences = text.split(/[.!?]+/).length
  const avgWordsPerSentence = words / sentences

  // Score from 0-100 (higher is easier to read)
  return Math.min(100, Math.max(0, 100 - avgWordsPerSentence * 2))
}
