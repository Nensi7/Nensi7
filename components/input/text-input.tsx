"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface TextInputProps {
  onTextChange: (text: string) => void
}

export function TextInput({ onTextChange }: TextInputProps) {
  const [text, setText] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    onTextChange(newText)
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={text}
        onChange={handleChange}
        placeholder="Type or paste your text here..."
        className="min-h-[300px] resize-y bg-muted/50 border-border text-base leading-relaxed"
      />
    </div>
  )
}
