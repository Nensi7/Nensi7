"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getHistory, deleteHistoryItem, clearHistory, type HistoryItem } from "@/lib/history-storage"
import { Loader2, Trash2, Eye, Calendar, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ResultsDisplay } from "@/components/results-display"

export default function HistoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
    if (user) {
      loadHistory()
    }
  }, [user, isLoading, router])

  const loadHistory = () => {
    if (user) {
      const userHistory = getHistory(user.id)
      setHistory(userHistory)
    }
  }

  const handleDelete = (id: string) => {
    deleteHistoryItem(id)
    loadHistory()
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearHistory(user?.id)
      loadHistory()
    }
  }

  const handleView = (item: HistoryItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const getModuleName = (moduleType: string) => {
    const names: Record<string, string> = {
      "problem-solver": "AI Problem Solver",
      "text-enhancement": "Text Enhancement",
      "plagiarism-check": "Plagiarism Check",
      "title-generator": "Title Generator",
    }
    return names[moduleType] || moduleType
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Processing History</h1>
            <p className="text-muted-foreground">View and manage your past NLP processing results</p>
          </div>
          {history.length > 0 && (
            <Button variant="destructive" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your processing history will appear here after you use the NLP modules
                </p>
                <Button onClick={() => router.push("/")}>Start Processing</Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                        {getModuleName(item.moduleType)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.inputText}</p>
                    {item.results?.metadata && (
                      <div className="flex gap-2 text-xs">
                        {Object.entries(item.results.metadata)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <span key={key} className="text-muted-foreground">
                              {key}: <span className="font-medium">{value}</span>
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(item)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Processing Result</DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <span className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                    {getModuleName(selectedItem.moduleType)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedItem.timestamp).toLocaleString()}
                  </span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedItem?.results && (
            <ResultsDisplay
              results={selectedItem.results}
              moduleType={selectedItem.moduleType}
              inputText={selectedItem.inputText}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
