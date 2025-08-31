"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Upload, FileText, CheckCircle, AlertCircle, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { analyzeCv } from "@/lib/api"
import type { CareerAnalysis } from "@/lib/types"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        droppedFile.type === "text/plain"
      ) {
        setFile(droppedFile)
        setError(null)
      } else {
        setError("Por favor, envie apenas arquivos PDF, DOCX ou TXT")
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeCv(file)
      setAnalysis(result)
      // Store in localStorage for next steps
      localStorage.setItem("careerAnalysis", JSON.stringify(result))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao analisar currículo")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleContinue = () => {
    router.push("/roadmap")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">CareerMentor</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Etapa 1 de 4</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground mb-4">Análise do Seu Perfil Profissional</h1>
          <p className="text-muted-foreground text-lg">
            Envie seu currículo para uma análise completa das suas skills e experiência
          </p>
        </div>

        {!analysis ? (
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload do Currículo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-4">
                      <FileText className="w-12 h-12 text-primary mx-auto" />
                      <div>
                        <p className="font-semibold text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button onClick={() => setFile(null)} variant="outline" size="sm">
                        Remover arquivo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-foreground font-semibold mb-2">
                          Arraste seu currículo aqui ou clique para selecionar
                        </p>
                        <p className="text-sm text-muted-foreground">Formatos aceitos: PDF, DOCX, TXT (máx. 10MB)</p>
                      </div>
                      <Input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload">
                        <Button variant="outline" asChild>
                          <span>Selecionar arquivo</span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>

                {error && (
                  <Alert className="mt-4" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="mt-6 flex justify-center">
                  <Button onClick={handleAnalyze} disabled={!file || isAnalyzing} size="lg" className="px-8">
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Analisando...
                      </>
                    ) : (
                      "Analisar Currículo"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isAnalyzing && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Analisando seu perfil...</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="w-full" />
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>✓ Extraindo texto do documento</p>
                      <p>✓ Identificando skills e experiências</p>
                      <p className="text-primary">→ Mapeando competências transferíveis</p>
                      <p>• Gerando recomendações personalizadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Análise concluída com sucesso! Revise as informações abaixo e faça ajustes se necessário.
              </AlertDescription>
            </Alert>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo</Label>
                    <Input
                      value={analysis.profile.fullName}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          profile: { ...analysis.profile, fullName: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Anos de Experiência</Label>
                    <Input
                      type="number"
                      value={analysis.profile.yearsExperience}
                      onChange={(e) =>
                        setAnalysis({
                          ...analysis,
                          profile: { ...analysis.profile, yearsExperience: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Área de Interesse</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={analysis.profile.desiredArea}
                    onChange={(e) =>
                      setAnalysis({
                        ...analysis,
                        profile: { ...analysis.profile, desiredArea: e.target.value as any },
                      })
                    }
                  >
                    <option value="">Selecione uma área</option>
                    <option value="frontend">Frontend Development</option>
                    <option value="backend">Backend Development</option>
                    <option value="data">Data Science</option>
                    <option value="ux">UX/UI Design</option>
                    <option value="pm">Product Management</option>
                    <option value="cloud">Cloud Computing</option>
                    <option value="qa">Quality Assurance</option>
                    <option value="devops">DevOps</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Skills Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Competências</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Skills Técnicas</h4>
                  <div className="space-y-2">
                    {analysis.skills.hard.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">{skill.name}</span>
                        <Badge
                          variant={
                            skill.level === "advanced"
                              ? "default"
                              : skill.level === "intermediate"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {skill.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Pontos Fortes</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {analysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {analysis.targetRoles.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3">Cargos Recomendados</h4>
                      <div className="space-y-3">
                        {analysis.targetRoles.map((role, index) => (
                          <Card key={index} className="p-4">
                            <h5 className="font-semibold text-primary">{role.title}</h5>
                            {role.why && <p className="text-sm text-muted-foreground mt-1">{role.why}</p>}
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button onClick={handleContinue} size="lg" className="px-8">
                Continuar para Roadmap
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
