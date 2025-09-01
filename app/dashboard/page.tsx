"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  TrendingUp,
  Code,
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  Users,
  Target,
  Crown,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { ChatWidget } from "@/components/chat-widget"

type TimelineStatus = "current" | "upcoming" | "completed"

export default function DashboardPage() {
  const techScore = 72
  const skillsCount = 8

  const timelineItems: { month: string; title: string; status: TimelineStatus }[] = [
    {
      month: "MÊS 1-2",
      title: "HTML/CSS/JavaScript Básico",
      status: "current" as const,
    },
    {
      month: "MÊS 3-4",
      title: "React Fundamentals",
      status: "upcoming" as const,
    },
    {
      month: "MÊS 5-6",
      title: "Projetos Práticos",
      status: "upcoming" as const,
    },
    {
      month: "MÊS 7-8",
      title: "Portfolio + Job Search",
      status: "upcoming" as const,
    },
    {
      month: "MÊS 9-10",
      title: "Primeiro Emprego",
      status: "upcoming" as const,
    },
  ]

  const statusColor: Record<TimelineStatus, string> = {
    current: "bg-primary",
    completed: "bg-green-500",
    upcoming: "bg-slate-300",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900">TechTransition</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/analytics" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
              </Button>
              <span className="text-lg font-semibold text-slate-900">Olá, João!</span>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section - Score */}
        <Card className="border-2 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h1 className="font-display font-bold text-3xl text-slate-900">
                  Seu Score de Prontidão Tech: <span className="text-primary">{techScore}/100</span>
                </h1>
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${techScore}, 100`}
                      strokeLinecap="round"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{techScore}</span>
                  </div>
                </div>
                <p className="text-lg text-slate-600">
                  Você tem <span className="font-semibold text-primary">{skillsCount} skills transferíveis</span>{" "}
                  identificadas
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-lg p-4 text-center">
                    <Code className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">15</div>
                    <div className="text-sm text-slate-600">Dias de streak</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4 text-center">
                    <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">8</div>
                    <div className="text-sm text-slate-600">Conquistas desbloqueadas</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4 text-center">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">127</div>
                    <div className="text-sm text-slate-600">Horas estudadas</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">42%</div>
                    <div className="text-sm text-slate-600">Do roadmap concluído</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trilha Recomendada */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-display font-bold text-2xl text-slate-900 flex items-center space-x-2">
              <Code className="w-6 h-6 text-primary" />
              <span>Sua Trilha Recomendada</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-display font-bold text-xl text-slate-900">Frontend Developer</h3>
                <p className="text-slate-600">Com base na sua experiência em design e comunicação</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">Tempo estimado: 8-10 meses</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">Salário médio: R$ 4.500 - R$ 8.000</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Visual */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-display font-bold text-2xl text-slate-900">Timeline Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineItems.map((item) => (
                <div key={`${item.month}-${item.title}`} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${statusColor[item.status]}`}
                    />
                    <Badge
                      variant={item.status === "current" ? "default" : "secondary"}
                      className={item.status === "current" ? "bg-primary" : ""}
                    >
                      {item.month}
                    </Badge>
                  </div>
                  <span className={`font-medium ${item.status === "current" ? "text-primary" : "text-slate-600"}`}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action Premium */}
        <Card className="border-2 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Crown className="w-6 h-6 text-amber-600" />
                  <h2 className="font-display font-bold text-2xl text-slate-900">Desbloqueie seu Roadmap Completo</h2>
                </div>
                <p className="text-slate-600">Acelere sua transição com recursos premium e suporte personalizado</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">Recursos detalhados para cada etapa</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">Projetos práticos passo a passo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">Templates de portfólio e currículo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">Simulados de entrevista</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-slate-900">
                  <span className="line-through text-slate-500">R$ 97</span>
                  <span className="text-primary ml-2">R$ 47/mês</span>
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-full" asChild>
                  <Link href="/roadmap">
                    Assinar Premium
                    <Crown className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <p className="text-sm text-slate-500">Cancele quando quiser</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos Gratuitos */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-display font-bold text-2xl text-slate-900">Próximos Passos Gratuitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-medium">Link para curso gratuito HTML</span>
                </div>
                <Button variant="outline" size="sm">
                  Acessar
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Code className="w-5 h-5 text-primary" />
                  <span className="font-medium">Link para documentação React</span>
                </div>
                <Button variant="outline" size="sm">
                  Acessar
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium">Comunidade Discord</span>
                </div>
                <Button variant="outline" size="sm">
                  Participar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ChatWidget component */}
      <ChatWidget />
    </div>
  )
}
