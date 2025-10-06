// Local storage utilities for processing history

export interface HistoryItem {
  id: string
  userId: string
  moduleType: string
  inputText: string
  results: any
  timestamp: string
}

const HISTORY_KEY = "nlp_processing_history"
const MAX_HISTORY_ITEMS = 50

export function saveToHistory(item: Omit<HistoryItem, "id" | "timestamp">): void {
  const history = getHistory()

  const newItem: HistoryItem = {
    ...item,
    id: generateId(),
    timestamp: new Date().toISOString(),
  }

  history.unshift(newItem)

  // Keep only the most recent items
  const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS)

  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory))
}

export function getHistory(userId?: string): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (!stored) return []

    const history: HistoryItem[] = JSON.parse(stored)

    if (userId) {
      return history.filter((item) => item.userId === userId)
    }

    return history
  } catch (error) {
    console.error("[v0] Error loading history:", error)
    return []
  }
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory()
  const filtered = history.filter((item) => item.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
}

export function clearHistory(userId?: string): void {
  if (userId) {
    const history = getHistory()
    const filtered = history.filter((item) => item.userId !== userId)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
  } else {
    localStorage.removeItem(HISTORY_KEY)
  }
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
