"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Upload, CheckCircle, Brain, Sparkles } from "lucide-react"
import Link from "next/link"

type AssessmentStep = 1 | 2 | 3

interface AssessmentData {
  resume?: File
  skills?: string[]
  techArea?: string
  timeCommitment?: string
  timeline?: string
}

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>(1)
  const [data, setData] = useState<AssessmentData>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const progressPercentage = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setData((prev) => ({
        ...prev,
        resume: file,
        skills: ["JavaScript", "Comunicação", "Gestão de Projetos", "Excel Avançado", "Inglês Fluente"],
      }))
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as AssessmentStep)
    }
    if (currentStep === 2) {
      setIsProcessing(true)
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false)
        // Redirect to dashboard would happen here
      }, 3000)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as AssessmentStep)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
            <span className="text-slate-600">Voltar</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">Passo {currentStep} de 3</div>
            <Progress value={progressPercentage} className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Step 1: Upload Currículo */}
        {currentStep === 1 && (
          <Card className="border-2">
            <CardHeader className="text-center pb-8">
              <CardTitle className="font-display font-bold text-3xl text-slate-900 mb-4">
                Vamos analisar sua experiência
              </CardTitle>
              <p className="text-lg text-slate-600">
                Faça upload do seu currículo para identificarmos suas skills transferíveis
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {!data.resume ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Arraste seu currículo aqui (PDF)</h3>
                  <p className="text-slate-600 mb-6">Ou clique no botão abaixo para selecionar arquivo</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button className="bg-primary hover:bg-primary/90">Selecionar arquivo</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">Currículo analisado com sucesso</p>
                      <p className="text-sm text-green-700">{data.resume.name}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg text-slate-900 mb-4">
                      Encontramos {data.skills?.length} skills relevantes:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.skills?.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                      Próximo
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Perguntas Personalizadas */}
        {currentStep === 2 && (
          <Card className="border-2">
            <CardHeader className="text-center pb-8">
              <CardTitle className="font-display font-bold text-3xl text-slate-900 mb-4">
                Conte mais sobre seus objetivos
              </CardTitle>
              <p className="text-lg text-slate-600">Algumas perguntas para personalizar seu roadmap</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Pergunta 1 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900">1. Que área de tech mais te interessa?</h3>
                <RadioGroup
                  value={data.techArea}
                  onValueChange={(value) => setData((prev) => ({ ...prev, techArea: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frontend" id="frontend" />
                    <Label htmlFor="frontend">Frontend Development</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="backend" id="backend" />
                    <Label htmlFor="backend">Backend Development</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="data" id="data" />
                    <Label htmlFor="data">Data Science</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="product" id="product" />
                    <Label htmlFor="product">Product Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ux" id="ux" />
                    <Label htmlFor="ux">UX/UI Design</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Pergunta 2 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900">2. Quanto tempo você pode dedicar aos estudos?</h3>
                <RadioGroup
                  value={data.timeCommitment}
                  onValueChange={(value) => setData((prev) => ({ ...prev, timeCommitment: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-2h" id="1-2h" />
                    <Label htmlFor="1-2h">1-2h por dia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-5h" id="3-5h" />
                    <Label htmlFor="3-5h">3-5h por dia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="integral" id="integral" />
                    <Label htmlFor="integral">Tempo integral</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Pergunta 3 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-slate-900">3. Qual seu objetivo de prazo?</h3>
                <RadioGroup
                  value={data.timeline}
                  onValueChange={(value) => setData((prev) => ({ ...prev, timeline: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6m" id="6m" />
                    <Label htmlFor="6m">6 meses</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1y" id="1y" />
                    <Label htmlFor="1y">1 ano</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2y" id="2y" />
                    <Label htmlFor="2y">2 anos</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Voltar
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90"
                  disabled={!data.techArea || !data.timeCommitment || !data.timeline}
                >
                  Gerar Meu Roadmap
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Processamento */}
        {currentStep === 3 && (
          <Card className="border-2">
            <CardContent className="py-16 text-center">
              <div className="space-y-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Brain className="w-12 h-12 text-primary" />
                </div>

                <div className="space-y-4">
                  <h2 className="font-display font-bold text-3xl text-slate-900">
                    {isProcessing ? "Analisando seu perfil..." : "Roadmap criado com sucesso!"}
                  </h2>

                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-primary">
                        <Sparkles className="w-5 h-5 animate-spin" />
                        <span className="text-lg">Identificando skills transferíveis...</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-primary">
                        <Sparkles className="w-5 h-5 animate-spin" />
                        <span className="text-lg">Criando roadmap personalizado...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-lg text-slate-600">
                        Seu roadmap personalizado está pronto! Vamos começar sua jornada em tech.
                      </p>
                      <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                        <Link href="/dashboard">
                          Ver Meu Dashboard
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="text-sm text-slate-500">
                  {isProcessing ? "Demora 10-15 segundos para impacto" : "Pronto para começar!"}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
