"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp,
  Settings,
  Send,
  MessageSquare,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Lightbulb,
  Save,
  RefreshCw,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { ChatWidget } from "@/components/chat-widget"
import type { CareerAnalysis, CareerPlan, ChatMessage, CoachResponse } from "@/lib/types"
import { coachPost, createGoal } from "@/lib/api"

interface ChatBubbleProps {
  message: ChatMessage
}

function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) return null // Don't render system messages

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isUser ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-900"
        }`}
      >
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  )
}

export default function CoachPage() {
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null)
  const [plan, setPlan] = useState<CareerPlan | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastResponse, setLastResponse] = useState<CoachResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [actionsSaved, setActionsSaved] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load context from localStorage
  useEffect(() => {
    const savedAnalysis = localStorage.getItem("careerAnalysis")
    const savedPlan = localStorage.getItem("careerPlan")

    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis)
        const normalized = (parsed?.CareerAnalysis ?? parsed?.careerAnalysis ?? parsed) as CareerAnalysis
        setAnalysis(normalized)
      } catch (e) {
        console.error("Failed to parse saved analysis:", e)
      }
    }

    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan))
      } catch (e) {
        console.error("Failed to parse saved plan:", e)
      }
    }

    setIsInitialized(true)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize with context injection
  useEffect(() => {
    if (isInitialized && analysis && messages.length === 0) {
      const contextMessage: ChatMessage = {
        role: "system",
        content: `CONTEXT:
analysis=${JSON.stringify(analysis)}
plan=${plan ? JSON.stringify(plan) : "{}"}`,
      }

      const initialMessage: ChatMessage = {
        role: "user",
        content: `Olá! Sou ${analysis.profile.fullName} e acabei de gerar meu roadmap de carreira para ${analysis.profile.desiredArea}. Tenho ${plan?.summary.timeBudgetHoursPerWeek || 10}h/semana disponíveis. Me dê 3 próximas ações específicas para esta semana com prazos definidos.`,
      }

      setMessages([contextMessage, initialMessage])
      handleSendMessage([contextMessage, initialMessage])
    }
  }, [isInitialized, analysis, plan])

  // Reset 'saved' state when a new coach response arrives
  useEffect(() => {
    setActionsSaved(false)
  }, [lastResponse])

  const handleSendMessage = async (messagesToSend?: ChatMessage[]) => {
    const currentMessages = messagesToSend || [...messages, { role: "user" as const, content: input }]

    if (!messagesToSend) {
      setMessages(currentMessages)
      setInput("")
    }

    setIsLoading(true)
    setError(null)
    setLastResponse(null)

    try {
      const response = await coachPost({ messages: currentMessages })
      console.log("Received response:", response)
      
      setIsLoading(false)
      setLastResponse(response)

      // Add coach response to messages
      const coachMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
      }
      setMessages((prev) => [...prev, coachMessage])
    } catch (err) {
      setIsLoading(false)
      setError(err instanceof Error ? err.message : "Erro ao conectar com o coach")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim() && !isLoading) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRetry = () => {
    if (messages.length > 0) {
      handleSendMessage(messages)
    }
  }

  const handleSaveAsGoal = async () => {
    if (!lastResponse?.next_actions?.length) {
      return
    }

    try {
      const goal = {
        title: `Coach Sprint - ${new Date().toLocaleDateString("pt-BR")}`,
        horizon: "7d",
        metric: "Completar ações sugeridas pelo coach",
        nextActions: lastResponse.next_actions.map((action) => ({
          title: action.title,
          effortHours: action.effortHours,
          dueDate: action.dueDate || null,
        })),
      }

      await createGoal(goal)

      // Show success feedback
  setError(null)
  setActionsSaved(true)
  setSaveSuccess(true)
  setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError("Falha ao salvar meta: " + (err instanceof Error ? err.message : "Erro desconhecido"))
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/roadmap" className="flex items-center space-x-2">
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!analysis && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Contexto não encontrado.
              <Link href="/upload" className="ml-2 text-primary hover:underline">
                Faça a análise do seu currículo primeiro →
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {analysis && (
          <div className="space-y-6">
            {saveSuccess && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Metas salvas com sucesso! Veja em "Metas".
                </AlertDescription>
              </Alert>
            )}
            {/* Header */}
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">ETAPA 3: COACH IA</Badge>
              <h1 className="font-display font-bold text-4xl text-slate-900">Seu Coach de Carreira</h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Converse com sua IA especializada em transição de carreira para tech
              </p>
            </div>

            {/* Chat Container */}
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span>Chat com Coach</span>
                  {isLoading && (
                    <Badge variant="secondary" className="ml-auto">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Processando
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages
                  .filter((msg) => msg.role !== "system")
                  .map((message, index) => (
                    <ChatBubble
                      key={index}
                      message={message}
                    />
                  ))}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start mb-4">
                    <div className="max-w-[80%] p-4 rounded-lg bg-white border border-slate-200 text-slate-900">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Coach está pensando...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="flex-shrink-0 p-4 border-t">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      {error}
                      <Button variant="outline" size="sm" onClick={handleRetry}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Tentar Novamente
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua pergunta sobre carreira..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={() => handleSendMessage()} disabled={!input.trim() || isLoading} size="icon">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Coach Response Details */}
      {lastResponse && (
              <div className="space-y-4">
                {/* Next Actions */}
        {!actionsSaved && Array.isArray(lastResponse.next_actions) && lastResponse.next_actions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span>Próximas Ações</span>
                        </div>
            <Button variant="outline" size="sm" onClick={handleSaveAsGoal}>
                          <Save className="w-4 h-4 mr-1" />
                          Salvar como Meta
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {lastResponse.next_actions.map((action, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <h4 className="font-medium text-slate-900">{action.title}</h4>
                              <div className="text-sm text-slate-600 flex items-center space-x-4">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{action.effortHours}h de esforço</span>
                                </span>
                                {action.dueDate && (
                                  <span>Prazo: {new Date(action.dueDate).toLocaleDateString("pt-BR")}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tips */}
                {Array.isArray(lastResponse.tips) && lastResponse.tips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <span>Dicas e Recursos</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {lastResponse.tips.map((tip, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8">
              <Button variant="outline" asChild>
                <Link href="/roadmap">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Voltar ao Roadmap
                </Link>
              </Button>
              <Button asChild>
                <Link href="/goals">
                  Ver Metas Salvas
                  <CheckCircle className="ml-2 w-4 h-4" />
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
