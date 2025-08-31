"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp,
  Settings,
  Briefcase,
  CheckCircle,
  Clock,
  Target,
  Award,
  ChevronRight,
  Loader2,
  ExternalLink,
  Calendar,
  Users,
  BarChart3,
  MessageSquare,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { ChatWidget } from "@/components/chat-widget"
import type { CareerAnalysis, CareerPlan } from "@/lib/types"
import { generateRoadmap } from "@/lib/api"

export default function RoadmapPage() {
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null)
  const [plan, setPlan] = useState<CareerPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form parameters
  const [hoursPerWeek, setHoursPerWeek] = useState([10])
  const [horizonMonths, setHorizonMonths] = useState("6")
  const [focusArea, setFocusArea] = useState("")

  useEffect(() => {
    const savedAnalysis = localStorage.getItem("careerAnalysis")
    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis))
      } catch (e) {
        console.error("Failed to parse saved analysis:", e)
      }
    }
  }, [])

  const handleGenerateRoadmap = async () => {
    if (!analysis) {
      setError("Análise de CV não encontrada. Faça o upload do seu currículo primeiro.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const roadmapData = await generateRoadmap(analysis, hoursPerWeek[0], Number.parseInt(horizonMonths), focusArea)
      setPlan(roadmapData)

      // Save plan to localStorage for coach context
      localStorage.setItem("careerPlan", JSON.stringify(roadmapData))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar roadmap")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/upload" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900">CareerMentor</span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-slate-900">{analysis?.profile.fullName || "Usuário"}</span>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {!analysis && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Análise de CV não encontrada.
              <Link href="/upload" className="ml-2 text-primary hover:underline">
                Faça o upload do seu currículo primeiro →
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {analysis && !plan && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">ETAPA 2: GERAR ROADMAP</Badge>
              <h1 className="font-display font-bold text-4xl text-slate-900">Configure Seu Plano de Carreira</h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Personalize seu roadmap com base na sua disponibilidade e objetivos profissionais
              </p>
            </div>

            {/* Configuration Form */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="font-display font-bold text-2xl text-slate-900">Parâmetros do Roadmap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hours per week */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Horas disponíveis por semana: {hoursPerWeek[0]}h</Label>
                  <Slider
                    value={hoursPerWeek}
                    onValueChange={setHoursPerWeek}
                    max={40}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>5h (mínimo)</span>
                    <span>40h (tempo integral)</span>
                  </div>
                </div>

                <Separator />

                {/* Horizon months */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Prazo desejado</Label>
                  <Select value={horizonMonths} onValueChange={setHorizonMonths}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 meses (intensivo)</SelectItem>
                      <SelectItem value="6">6 meses (recomendado)</SelectItem>
                      <SelectItem value="9">9 meses (equilibrado)</SelectItem>
                      <SelectItem value="12">12 meses (flexível)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Focus area */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Área de foco</Label>
                  <Select value={focusArea} onValueChange={setFocusArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua área de interesse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend Development</SelectItem>
                      <SelectItem value="backend">Backend Development</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                      <SelectItem value="qa">Quality Assurance</SelectItem>
                      <SelectItem value="cloud">Cloud Computing</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleGenerateRoadmap} disabled={loading || !focusArea} className="w-full" size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Gerando Roadmap...
                    </>
                  ) : (
                    <>
                      Gerar Roadmap Personalizado
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {plan && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <Badge className="bg-green-100 text-green-700 border-green-200">ROADMAP GERADO</Badge>
              <h1 className="font-display font-bold text-4xl text-slate-900">{plan.summary.headline}</h1>
              <p className="text-xl text-slate-600">Seu plano personalizado para {plan.summary.horizonMonths} meses</p>
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{plan.summary.readinessScore}%</div>
                  <div className="text-sm text-slate-600">Score de Prontidão</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{plan.summary.timeBudgetHoursPerWeek}h</div>
                  <div className="text-sm text-slate-600">Horas/Semana</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{plan.summary.horizonMonths}</div>
                  <div className="text-sm text-slate-600">Meses</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{plan.path.length}</div>
                  <div className="text-sm text-slate-600">Fases</div>
                </CardContent>
              </Card>
            </div>

            {/* Path phases */}
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-slate-900">Fases do Roadmap</h2>
              {plan.path.map((phase, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <CardTitle className="font-display font-bold text-xl text-slate-900">{phase.phase}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Outcomes */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Objetivos:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {phase.outcomes.map((outcome, i) => (
                          <li key={i}>{outcome}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Hard Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.hardSkills.map((skill, i) => (
                            <Badge key={i} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Soft Skills:</h4>
                        <div className="space-y-2">
                          {phase.softSkills.map((skill, i) => (
                            <div key={i} className="text-sm">
                              <span className="font-medium">{skill.name}:</span>
                              <span className="text-slate-600 ml-1">{skill.exercise}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Projects */}
                    {phase.diyProjects.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Projetos Práticos:</h4>
                        <div className="grid gap-3">
                          {phase.diyProjects.map((project, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg">
                              <h5 className="font-medium text-slate-900">{project.title}</h5>
                              <p className="text-sm text-slate-600 mb-2">{project.brief}</p>
                              <div className="text-xs text-slate-500">
                                Critérios: {project.acceptanceCriteria.join(", ")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {phase.resources.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Recursos:</h4>
                        <div className="grid gap-2">
                          {phase.resources.map((resource, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <div className="flex items-center space-x-2">
                                <ExternalLink className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium">{resource.title}</span>
                                <Badge variant={resource.free ? "secondary" : "outline"} className="text-xs">
                                  {resource.free ? "Gratuito" : "Pago"}
                                </Badge>
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  Acessar
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Milestones */}
                    {phase.milestones.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Marcos:</h4>
                        <div className="space-y-2">
                          {phase.milestones.map((milestone, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-primary/5 rounded">
                              <div className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{milestone.title}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {milestone.dueDays} dias
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional plans */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Interview Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <span>Plano de Entrevistas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Cronograma:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                      {plan.interviewPlan.schedule.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Temas de Estudo:</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.interviewPlan.questionBankTags.map((tag, i) => (
                        <Badge key={i} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Networking Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>Plano de Networking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Rotinas Semanais:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                      {plan.networkingPlan.weeklyRoutines.map((routine, i) => (
                        <li key={i}>{routine}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Alvos:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                      {plan.networkingPlan.targets.map((target, i) => (
                        <li key={i}>{target}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Actions */}
            {plan.nextActions.length > 0 && (
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Próximas Ações</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plan.nextActions.map((action, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900">{action.title}</h4>
                          <div className="text-sm text-slate-600">
                            {action.effortHours}h de esforço
                            {action.dueDate && ` • Prazo: ${new Date(action.dueDate).toLocaleDateString("pt-BR")}`}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Marcar como Feito
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8">
              <Button variant="outline" asChild>
                <Link href="/upload">← Voltar para Análise</Link>
              </Button>
              <Button asChild>
                <Link href="/coach">
                  Conversar com Coach
                  <MessageSquare className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <ChatWidget />
    </div>
  )
}
