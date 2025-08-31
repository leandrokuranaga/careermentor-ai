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
import { coachStreamPost, createGoal } from "@/lib/api"

interface ChatBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
  streamContent?: string
}

function ChatBubble({ message, isStreaming, streamContent }: ChatBubbleProps) {
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
          {isStreaming && streamContent && <span className="opacity-70">{streamContent}</span>}
        </div>
        {isStreaming && (
          <div className="flex items-center space-x-2 mt-2 opacity-70">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Coach está digitando...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CoachPage() {
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null)
  const [plan, setPlan] = useState<CareerPlan | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamContent, setStreamContent] = useState("")
  const [lastResponse, setLastResponse] = useState<CoachResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load context from localStorage
  useEffect(() => {
    const savedAnalysis = localStorage.getItem("careerAnalysis")
    const savedPlan = localStorage.getItem("careerPlan")

    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis))
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
  }, [messages, streamContent])

  // Initialize with context injection
  useEffect(() => {
    if (isInitialized && analysis && messages.length === 0) {
      const contextMessage: ChatMessage = {
        role: "user",
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

  const handleSendMessage = async (messagesToSend?: ChatMessage[]) => {
    const currentMessages = messagesToSend || [...messages, { role: "user" as const, content: input }]

    if (!messagesToSend) {
      setMessages(currentMessages)
      setInput("")
    }

    setIsStreaming(true)
    setStreamContent("")
    setError(null)
    setLastResponse(null)

    try {
      await coachStreamPost(
        { messages: currentMessages },
        (chunk: string) => {
          setStreamContent((prev) => prev + chunk)
        },
        (response: CoachResponse) => {
          setIsStreaming(false)
          setStreamContent("")
          setLastResponse(response)

          // Add coach response to messages
          const coachMessage: ChatMessage = {
            role: "assistant",
            content: response.message,
          }
          setMessages((prev) => [...prev, coachMessage])
        },
      )
    } catch (err) {
      setIsStreaming(false)
      setStreamContent("")
      setError(err instanceof Error ? err.message : "Erro ao conectar com o coach")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim() && !isStreaming) {
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
    if (!lastResponse || lastResponse.next_actions.length === 0) return

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
      // You could add a toast here
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
                  {isStreaming && (
                    <Badge variant="secondary" className="ml-auto">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Conectado
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
                      isStreaming={isStreaming && index === messages.length - 1 && message.role === "assistant"}
                      streamContent={streamContent}
                    />
                  ))}

                {isStreaming && messages[messages.length - 1]?.role === "user" && (
                  <ChatBubble
                    message={{ role: "assistant", content: "" }}
                    isStreaming={true}
                    streamContent={streamContent}
                  />
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
                    disabled={isStreaming}
                    className="flex-1"
                  />
                  <Button onClick={() => handleSendMessage()} disabled={!input.trim() || isStreaming} size="icon">
                    {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Coach Response Details */}
            {lastResponse && (
              <div className="space-y-4">
                {/* Next Actions */}
                {lastResponse.next_actions.length > 0 && (
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
                {lastResponse.tips.length > 0 && (
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
