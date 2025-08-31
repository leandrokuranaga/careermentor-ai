export type SkillLevel = "beginner" | "intermediate" | "advanced"

export interface HardSkill {
  name: string
  level: SkillLevel
  evidence?: string
}

export interface SoftSkill {
  name: string
  level?: SkillLevel
  evidence?: string
}

export interface CareerAnalysis {
  profile: {
    fullName: string
    yearsExperience: number
    education: string[]
    languages: string[] // examples: ["PT-BR","EN-B2"]
    desiredArea: "frontend" | "backend" | "data" | "ux" | "pm" | "cloud" | "qa" | "devops" | ""
  }
  skills: {
    hard: HardSkill[]
    soft: SoftSkill[]
    certsOrCourses: string[]
  }
  strengths: string[]
  gaps: { hard: string[]; soft: string[] }
  targetRoles: {
    title: string
    why?: string
    mustHave?: string[]
    niceToHave?: string[]
  }[]
}

export interface CareerPlan {
  summary: {
    readinessScore: number
    timeBudgetHoursPerWeek: number
    horizonMonths: number
    headline: string
  }
  path: {
    phase: string
    outcomes: string[]
    hardSkills: string[]
    softSkills: { name: string; exercise: string }[]
    diyProjects: { title: string; brief: string; acceptanceCriteria: string[] }[]
    resources: { title: string; url: string; type: "course" | "doc" | "tool"; free: boolean }[]
    milestones: { title: string; dueDays: number; kpis?: Record<string, number> }[]
  }[]
  interviewPlan: { schedule: string[]; questionBankTags: string[]; homeworks: string[] }
  networkingPlan: { weeklyRoutines: string[]; targets: string[] }
  kpis: { portfolioProjects: number; passedMockInterviews: number; softSkillPracticesPerWeek: number }
  nextActions: { title: string; effortHours: number; dueDate?: string }[]
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
}

export interface CoachResponse {
  message: string
  next_actions: { title: string; effortHours: number; dueDate?: string }[]
  tips: string[]
  progressHooks: { taskKey: string; action: string }[]
}

export interface Goal {
  id: string
  title: string
  horizon: string // ex.: "14d"
  metric: string
  createdAt: string
  nextActions: NextAction[]
}

export interface NextAction {
  id: string
  goalId: string
  title: string
  effortHours: number
  dueDate?: string | null
}

// UI State types
export interface AppState {
  analysis: CareerAnalysis | null
  plan: CareerPlan | null
  currentStep: "upload" | "roadmap" | "coach" | "goals"
}
