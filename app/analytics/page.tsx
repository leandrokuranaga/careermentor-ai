"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Settings,
  Target,
  Clock,
  Award,
  Flame,
  Trophy,
  Users,
  Calendar,
  BookOpen,
  Code,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const achievements = [
    {
      id: "first-week",
      title: "Primeira semana completa",
      description: "Completou 7 dias consecutivos de estudo",
      icon: Trophy,
      earned: true,
      date: "15 dias atrás",
    },
    {
      id: "first-project",
      title: "Primeiro projeto finalizado",
      description: "Concluiu seu primeiro projeto prático",
      icon: Code,
      earned: true,
      date: "10 dias atrás",
    },
    {
      id: "30-days",
      title: "30 dias consecutivos",
      description: "Manteve streak de estudos por 30 dias",
      icon: Flame,
      earned: false,
      progress: 50,
    },
  ]

  const weeklyData = [
    { week: "Sem 1", hours: 12 },
    { week: "Sem 2", hours: 18 },
    { week: "Sem 3", hours: 15 },
    { week: "Sem 4", hours: 22 },
  ]

  const skillsData = [
    { month: "Jan", skills: 2 },
    { month: "Fev", skills: 5 },
    { month: "Mar", skills: 8 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900">TechTransition</span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-slate-900">Olá, João!</span>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-4">
          <h1 className="font-display font-bold text-4xl text-slate-900">Dashboard de Progresso</h1>
          <p className="text-xl text-slate-600">Acompanhe sua evolução e conquistas na jornada tech</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900 mb-1">42%</div>
              <div className="text-sm text-slate-600">Do roadmap concluído</div>
              <Progress value={42} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-2 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900 mb-1">15</div>
              <div className="text-sm text-slate-600">Dias de streak</div>
              <Badge className="mt-2 bg-orange-100 text-orange-700">Em chamas!</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900 mb-1">8</div>
              <div className="text-sm text-slate-600">Conquistas desbloqueadas</div>
              <Badge className="mt-2 bg-green-100 text-green-700">Parabéns!</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900 mb-1">127</div>
              <div className="text-sm text-slate-600">Horas estudadas</div>
              <Badge className="mt-2 bg-blue-100 text-blue-700">Dedicado!</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Gráfico Temporal */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-display font-bold text-2xl text-slate-900 flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-primary" />
                <span>Horas Estudadas por Semana</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium text-slate-600">{data.week}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Progress value={(data.hours / 25) * 100} className="flex-1" />
                        <span className="ml-3 text-sm font-semibold text-slate-900">{data.hours}h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Adquiridas */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-display font-bold text-2xl text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <span>Skills Adquiridas por Mês</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium text-slate-600">{data.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Progress value={(data.skills / 10) * 100} className="flex-1" />
                        <span className="ml-3 text-sm font-semibold text-slate-900">{data.skills} skills</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conquistas/Badges */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-display font-bold text-2xl text-slate-900 flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-primary" />
              <span>Conquistas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <div
                    key={achievement.id}
                    className={`p-6 rounded-lg border-2 text-center ${
                      achievement.earned
                        ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        achievement.earned ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{achievement.description}</p>
                    {achievement.earned ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Conquistado {achievement.date}
                      </Badge>
                    ) : (
                      <div className="space-y-2">
                        <Progress value={achievement.progress || 0} />
                        <Badge variant="secondary">{achievement.progress || 0}% completo</Badge>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-display font-bold text-2xl text-slate-900 flex items-center space-x-2">
              <Users className="w-6 h-6 text-primary" />
              <span>Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                  Você está no top 23% dos usuários!
                </h3>
                <p className="text-slate-600 mb-4">Continue assim para subir no ranking</p>
                <Badge className="bg-primary text-white">Ranking: #127 de 550 usuários</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <span className="font-medium text-slate-900">Usuário Anônimo</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">245h estudadas</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <span className="font-medium text-slate-900">Usuário Anônimo</span>
                  </div>
                  <Badge variant="secondary">198h estudadas</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <span className="font-medium text-slate-900">Usuário Anônimo</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700">187h estudadas</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
