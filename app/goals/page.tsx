"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  TrendingUp,
  Settings,
  Target,
  Plus,
  Clock,
  Calendar,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { ChatWidget } from "@/components/chat-widget"
import type { Goal } from "@/lib/types"
import { getGoals, createGoal } from "@/lib/api"

interface NewGoalForm {
  title: string
  horizon: string
  metric: string
  nextActions: {
    title: string
    effortHours: number
    dueDate: string
  }[]
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openGoals, setOpenGoals] = useState<Set<string>>(new Set())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  // New goal form state
  const [newGoal, setNewGoal] = useState<NewGoalForm>({
    title: "",
    horizon: "7d",
    metric: "",
    nextActions: [{ title: "", effortHours: 1, dueDate: "" }],
  })

  // Load goals on mount
  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getGoals()
      setGoals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar metas")
    } finally {
      setLoading(false)
    }
  }

  const toggleGoal = (goalId: string) => {
    const newOpenGoals = new Set(openGoals)
    if (newOpenGoals.has(goalId)) {
      newOpenGoals.delete(goalId)
    } else {
      newOpenGoals.add(goalId)
    }
    setOpenGoals(newOpenGoals)
  }

  const addNextAction = () => {
    setNewGoal({
      ...newGoal,
      nextActions: [...newGoal.nextActions, { title: "", effortHours: 1, dueDate: "" }],
    })
  }

  const removeNextAction = (index: number) => {
    setNewGoal({
      ...newGoal,
      nextActions: newGoal.nextActions.filter((_, i) => i !== index),
    })
  }

  const updateNextAction = (index: number, field: keyof NewGoalForm["nextActions"][0], value: string | number) => {
    const updatedActions = [...newGoal.nextActions]
    updatedActions[index] = { ...updatedActions[index], [field]: value }
    setNewGoal({ ...newGoal, nextActions: updatedActions })
  }

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.metric.trim()) {
      setError("Título e métrica são obrigatórios")
      return
    }

    if (newGoal.nextActions.some((action) => !action.title.trim())) {
      setError("Todas as ações devem ter um título")
      return
    }

    try {
      setCreating(true)
      setError(null)

      const goalData = {
        title: newGoal.title,
        horizon: newGoal.horizon,
        metric: newGoal.metric,
        nextActions: newGoal.nextActions.map((action) => ({
          title: action.title,
          effortHours: action.effortHours,
          dueDate: action.dueDate || null,
        })),
      }

      await createGoal(goalData)
      await loadGoals() // Reload goals list

      // Reset form
      setNewGoal({
        title: "",
        horizon: "7d",
        metric: "",
        nextActions: [{ title: "", effortHours: 1, dueDate: "" }],
      })
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar meta")
    } finally {
      setCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatHorizon = (horizon: string) => {
    const match = horizon.match(/(\d+)([dwmy])/)
    if (!match) return horizon

    const [, num, unit] = match
    const units = { d: "dias", w: "semanas", m: "meses", y: "anos" }
    return `${num} ${units[unit as keyof typeof units] || unit}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/coach" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900">CareerMentor</span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-slate-900">Metas</span>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20">ETAPA 4: METAS E HISTÓRICO</Badge>
            <h1 className="font-display font-bold text-4xl text-slate-900">Suas Metas de Carreira</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Acompanhe suas metas e ações sugeridas pelo coach para acelerar sua transição
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={loadGoals} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Sincronizar
              </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Nova Meta</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Basic info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título da Meta</Label>
                      <Input
                        id="title"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                        placeholder="Ex: Completar fundamentos de React"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="horizon">Prazo</Label>
                        <Select
                          value={newGoal.horizon}
                          onValueChange={(value) => setNewGoal({ ...newGoal, horizon: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7d">7 dias</SelectItem>
                            <SelectItem value="14d">14 dias</SelectItem>
                            <SelectItem value="1m">1 mês</SelectItem>
                            <SelectItem value="2m">2 meses</SelectItem>
                            <SelectItem value="3m">3 meses</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="metric">Métrica de Sucesso</Label>
                      <Textarea
                        id="metric"
                        value={newGoal.metric}
                        onChange={(e) => setNewGoal({ ...newGoal, metric: e.target.value })}
                        placeholder="Como você saberá que completou esta meta?"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Next Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Próximas Ações</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addNextAction}>
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Ação
                      </Button>
                    </div>

                    {newGoal.nextActions.map((action, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Ação {index + 1}</Label>
                            {newGoal.nextActions.length > 1 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeNextAction(index)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <Input
                            value={action.title}
                            onChange={(e) => updateNextAction(index, "title", e.target.value)}
                            placeholder="Descreva a ação"
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm">Horas de Esforço</Label>
                              <Input
                                type="number"
                                min="1"
                                max="40"
                                value={action.effortHours}
                                onChange={(e) =>
                                  updateNextAction(index, "effortHours", Number.parseInt(e.target.value))
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Prazo (opcional)</Label>
                              <Input
                                type="date"
                                value={action.dueDate}
                                onChange={(e) => updateNextAction(index, "dueDate", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateGoal} disabled={creating}>
                      {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Criar Meta
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Goals List */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-slate-600">Carregando suas metas...</p>
            </div>
          )}

          {error && !loading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button variant="outline" size="sm" onClick={loadGoals}>
                  Tentar Novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!loading && !error && goals.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg text-slate-900 mb-2">Nenhuma meta ainda</h3>
                <p className="text-slate-600 mb-6">
                  Crie sua primeira meta ou converse com o coach para receber sugestões personalizadas
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Meta
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/coach">Conversar com Coach</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !error && goals.length > 0 && (
            <div className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="border-2">
                  <Collapsible open={openGoals.has(goal.id)} onOpenChange={() => toggleGoal(goal.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {openGoals.has(goal.id) ? (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            )}
                            <div>
                              <CardTitle className="text-left">{goal.title}</CardTitle>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatHorizon(goal.horizon)}
                                </Badge>
                                <span className="text-sm text-slate-500">{goal.nextActions.length} ações</span>
                                <span className="text-sm text-slate-500">{formatDate(goal.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Metric */}
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">Métrica de Sucesso:</h4>
                            <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{goal.metric}</p>
                          </div>

                          {/* Next Actions */}
                          {goal.nextActions.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-3">Próximas Ações:</h4>
                              <div className="space-y-2">
                                {goal.nextActions.map((action) => (
                                  <div
                                    key={action.id}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <CheckCircle className="w-4 h-4 text-slate-400" />
                                      <div>
                                        <h5 className="font-medium text-slate-900">{action.title}</h5>
                                        <div className="text-sm text-slate-600 flex items-center space-x-4">
                                          <span className="flex items-center space-x-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{action.effortHours}h</span>
                                          </span>
                                          {action.dueDate && (
                                            <span className="flex items-center space-x-1">
                                              <Calendar className="w-3 h-3" />
                                              <span>{new Date(action.dueDate).toLocaleDateString("pt-BR")}</span>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Button variant="outline" asChild>
              <Link href="/coach">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar ao Coach
              </Link>
            </Button>
            <Button asChild>
              <Link href="/upload">Começar Nova Análise</Link>
            </Button>
          </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  )
}
