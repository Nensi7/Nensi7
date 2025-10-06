"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, ImageIcon, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { processDocument, validateFileType, formatFileSize } from "@/lib/ocr-processor"

interface DocumentUploadProps {
  onTextChange: (text: string) => void
}

export function DocumentUpload({ onTextChange }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedText, setExtractedText] = useState("")
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      processFiles(files)
    }
  }, [])

  const processFiles = async (files: File[]) => {
    setIsProcessing(true)
    setStatus("processing")
    setStatusMessage("Processing files...")
    setProgress(0)

    try {
      let allText = ""

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (!validateFileType(file)) {
          throw new Error(`Invalid file type: ${file.name}`)
        }

        setProgress(((i + 1) / files.length) * 100)
        setStatusMessage(`Processing ${file.name} (${formatFileSize(file.size)})...`)

        const extractedText = await processDocument(file)
        allText += extractedText + "\n\n"
      }

      setExtractedText(allText.trim())
      onTextChange(allText.trim())
      setStatus("success")
      setStatusMessage(`Successfully processed ${files.length} file(s)`)
    } catch (error) {
      console.error("[v0] Document processing error:", error)
      setStatus("error")
      setStatusMessage(error instanceof Error ? error.message : "Error processing files. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/10 scale-105"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
            <p className="text-sm text-muted-foreground">Supports PDF, JPG, JPEG, PNG files</p>
          </div>

          <div className="flex gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              <span>Images</span>
            </div>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{statusMessage}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <XCircle className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {extractedText && (
        <Card className="p-4 bg-muted/50 border-border max-h-[300px] overflow-y-auto">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{extractedText}</p>
        </Card>
      )}
    </div>
  )
}
