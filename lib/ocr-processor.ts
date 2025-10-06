// Mock OCR processing for document uploads
export async function processDocument(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = async () => {
      // Simulate OCR processing delay
      await new Promise((r) => setTimeout(r, 2000))

      // Mock extracted text based on file type
      const mockText = generateMockOCRText(file.name)
      resolve(mockText)
    }

    reader.readAsDataURL(file)
  })
}

function generateMockOCRText(filename: string): string {
  const isPDF = filename.toLowerCase().endsWith(".pdf")

  if (isPDF) {
    return `[Extracted from PDF: ${filename}]

This is a sample document containing important information about natural language processing and artificial intelligence applications.

Introduction
Natural Language Processing (NLP) has revolutionized how we interact with computers and process textual information. Modern NLP systems can understand context, sentiment, and semantic meaning with remarkable accuracy.

Key Concepts
1. Text Analysis: Breaking down and understanding written content
2. Machine Learning: Training models to recognize patterns in language
3. Semantic Understanding: Grasping the meaning behind words and phrases

Applications
NLP is used in various domains including:
- Chatbots and virtual assistants
- Content analysis and summarization
- Translation services
- Sentiment analysis

Conclusion
The field of NLP continues to evolve, offering new possibilities for human-computer interaction and automated text processing.`
  } else {
    return `[Extracted from Image: ${filename}]

Sample Text Document

This document contains text extracted from an image using OCR technology.

The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for testing purposes.

Additional content may include:
- Bullet points with information
- Numbered lists
- Paragraphs of text

OCR technology has improved significantly with modern machine learning approaches, enabling accurate text extraction from various image formats.`
  }
}

export function validateFileType(file: File): boolean {
  const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
  return validTypes.includes(file.type)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
