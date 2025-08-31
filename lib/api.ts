import type { CareerAnalysis, CareerPlan, ChatRequest, CoachResponse, Goal } from "./types"

const API_BASE = "https://localhost:7069"

//process.env.NEXT_PUBLIC_API_BASE ||

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

  return response.json()
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
  let textBuffer = ""

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split(/\r?\n/)

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const payload = line.slice(6)
        textBuffer += payload
        onChunk(payload)
      } else if (line.startsWith("event: done")) {
        // Stream finished
      }
    }
  }

  // Parse final JSON
  let obj: CoachResponse = {
    message: "",
    next_actions: [],
    tips: [],
    progressHooks: [],
  }

  try {
    obj = JSON.parse(textBuffer)
  } catch {
    const clean = textBuffer.replace(/\u0000/g, "").trim()
    obj = JSON.parse(clean)
  }

  onDone(obj)
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
