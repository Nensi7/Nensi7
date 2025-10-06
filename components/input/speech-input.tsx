"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SpeechInputProps {
  onTextChange: (text: string) => void
}

export function SpeechInput({ onTextChange }: SpeechInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [language, setLanguage] = useState("en-US")
  const [status, setStatus] = useState("Click the microphone to start recording")
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        setIsSupported(false)
        setStatus("Speech recognition is not supported in this browser")
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language

      recognition.onstart = () => {
        setIsRecording(true)
        setStatus("Listening... Speak now")
      }

      recognition.onresult = (event: any) => {
        let interim = ""
        let final = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcript + " "
          } else {
            interim += transcript
          }
        }

        if (final) {
          setTranscript((prev) => prev + final)
          onTextChange(transcript + final)
        }
        setInterimTranscript(interim)
      }

      recognition.onerror = (event: any) => {
        setStatus(`Error: ${event.error}`)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
        setStatus("Click the microphone to start recording")
        setInterimTranscript("")
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, onTextChange])

  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="en-GB">English (UK)</SelectItem>
            <SelectItem value="hi-IN">Hindi (India)</SelectItem>
            <SelectItem value="es-ES">Spanish</SelectItem>
            <SelectItem value="fr-FR">French</SelectItem>
            <SelectItem value="de-DE">German</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={toggleRecording}
          disabled={!isSupported}
          className={`w-32 h-32 rounded-full ${
            isRecording
              ? "bg-success hover:bg-success/90 animate-pulse glow"
              : "bg-gradient-to-br from-primary to-accent hover:opacity-90 glow"
          }`}
        >
          {isRecording ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
        </Button>

        <p className={`text-sm font-medium ${isRecording ? "text-success" : "text-muted-foreground"}`}>{status}</p>
      </div>

      <Card className="min-h-[200px] p-4 bg-muted/50 border-border">
        <div className="text-foreground leading-relaxed">
          {transcript || interimTranscript ? (
            <>
              <span>{transcript}</span>
              <span className="text-muted-foreground">{interimTranscript}</span>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8">Your speech will appear here in real-time...</p>
          )}
        </div>
      </Card>
    </div>
  )
}
