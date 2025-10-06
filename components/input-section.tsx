"use client"

import { useState } from "react"
import { Mic, FileUp, Keyboard } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpeechInput } from "@/components/input/speech-input"
import { DocumentUpload } from "@/components/input/document-upload"
import { TextInput } from "@/components/input/text-input"

export function InputSection() {
  const [currentText, setCurrentText] = useState("")

  return (
    <Card className="p-6 bg-card border-border animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Input Your Content</h2>
        <p className="text-muted-foreground">Choose your preferred input method to get started</p>
      </div>

      <Tabs defaultValue="speech" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="speech" className="gap-2">
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Live Speech</span>
          </TabsTrigger>
          <TabsTrigger value="document" className="gap-2">
            <FileUp className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Document</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="gap-2">
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">Type Text</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="speech" className="mt-0">
          <SpeechInput onTextChange={setCurrentText} />
        </TabsContent>

        <TabsContent value="document" className="mt-0">
          <DocumentUpload onTextChange={setCurrentText} />
        </TabsContent>

        <TabsContent value="text" className="mt-0">
          <TextInput onTextChange={setCurrentText} />
        </TabsContent>
      </Tabs>

      {currentText && (
        <div className="mt-4 text-sm text-muted-foreground text-right">
          {currentText.trim().split(/\s+/).length} words
        </div>
      )}
    </Card>
  )
}
