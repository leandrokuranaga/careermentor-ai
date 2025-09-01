import type { CareerAnalysis, CareerPlan, ChatRequest, CoachResponse, Goal } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://mentorai-fhhjfxf7axemckdh.brazilsouth-01.azurewebsites.net"

// CV Analysis API
export async function analyzeCv(file: File): Promise<CareerAnalysis> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE}/api/cv/analyze`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || "Falha ao analisar CV")
  }

  // Some backends wrap the payload like { "CareerAnalysis": { ... } }
  const data: any = await response.json()
  const analysis = (data?.CareerAnalysis ?? data?.careerAnalysis ?? data) as CareerAnalysis
  return analysis
}

// Roadmap Generation API
export async function generatePlan(
  analysis: CareerAnalysis,
  hoursPerWeek: number,
  horizonMonths: number,
  focusArea: string,
): Promise<CareerPlan> {
  const response = await fetch(`${API_BASE}/api/roadmap/from-cv`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, hoursPerWeek, horizonMonths, focusArea }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || "Falha ao gerar plano")
  }

  return response.json()
}

export { generatePlan as generateRoadmap }

// Coach SSE Streaming API
export async function coachStreamPost(
  req: ChatRequest,
  onChunk: (text: string) => void,
  onDone: (json: CoachResponse) => void,
): Promise<void> {
  type StreamState = { collectingFinal: boolean; aggregateBuffer: string; textBuffer: string }

  const sanitizeJsonString = (input: string): string =>
    Array.from(input)
      .filter((ch) => {
        const code = ch.charCodeAt(0)
        return code === 9 || code === 10 || code === 13 || code >= 32
      })
      .join("")
      .trim()

  const tryParseCoachResponse = (finalJson: string, fallbackMessage: string): CoachResponse => {
    if (!finalJson || finalJson.trim().length === 0) {
      return { message: fallbackMessage, next_actions: [], tips: [], progressHooks: [] }
    }
    try {
      return JSON.parse(finalJson)
    } catch {
      return JSON.parse(sanitizeJsonString(finalJson))
    }
  }

  const safeJsonParse = (s: string): object | null => {
    try {
      return JSON.parse(s)
    } catch {
      return null
    }
  }

  const pickText = (obj: object | null): string | null => {
    if (!obj || typeof obj !== "object") return null
    const rec = obj as Record<string, unknown>
    const candidates = [rec.delta, rec.text, rec.message, rec.content]
    for (const c of candidates) if (typeof c === "string" && c.trim()) return c
    return null
  }

  const processLine = (line: string, state: StreamState) => {
    if (line.startsWith("event: done")) {
      state.collectingFinal = true
      return
    }
    if (!line.startsWith("data: ")) return
    const payload = line.slice(6)
    // Always aggregate payload to reconstruct final JSON even before 'done'
    if (payload.trim() !== "{}") {
      state.aggregateBuffer += payload
    }
    // Only stream readable text chunks
    if (!state.collectingFinal) {
      const parsed = safeJsonParse(payload)
      const text = pickText(parsed)
      if (text != null) {
        state.textBuffer += text
        onChunk(text)
      }
    }
  }

  const response = await fetch(`${API_BASE}/api/coach/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(req),
  })

  if (!response.ok || !response.body) {
    throw new Error("Falha ao conectar no coach/stream")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const state: StreamState = { collectingFinal: false, aggregateBuffer: "", textBuffer: "" }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split(/\r?\n/)
    for (const line of lines) processLine(line, state)
  }

  const extractCandidate = (s: string): string => {
    const start = s.indexOf("{")
    const end = s.lastIndexOf("}")
    const candidate = start >= 0 && end > start ? s.slice(start, end + 1) : s
    return sanitizeJsonString(candidate)
  }

  const obj = tryParseCoachResponse(extractCandidate(state.aggregateBuffer), state.textBuffer)

  // Normalize to expected CoachResponse shape
  const normalized: CoachResponse = {
    message: (obj as any).message ?? (obj as any).text ?? "",
    next_actions: (obj as any).next_actions ?? (obj as any).nextActions ?? [],
    tips: (obj as any).tips ?? (obj as any).suggestions ?? [],
    progressHooks: (obj as any).progressHooks ?? [],
  }

  onDone(normalized)
}

// Goals API
export async function getGoals(): Promise<Goal[]> {
  const response = await fetch(`${API_BASE}/api/goals`)
  if (!response.ok) throw new Error("Falha ao listar goals")
  return response.json()
}

export async function createGoal(goal: {
  title: string
  horizon: string
  metric: string
  nextActions: { title: string; effortHours: number; dueDate?: string | null }[]
}): Promise<Goal> {
  const response = await fetch(`${API_BASE}/api/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  })

  if (!response.ok) throw new Error("Falha ao criar goal")
  return response.json()
}
