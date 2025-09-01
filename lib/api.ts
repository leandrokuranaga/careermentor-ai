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


// Coach Non-Streaming API
export async function coachPost(req: ChatRequest): Promise<CoachResponse> {
  const response = await fetch(`${API_BASE}/api/coach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })

  if (!response.ok) {
    throw new Error("Falha ao conectar no coach")
  }

  return response.json()
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
