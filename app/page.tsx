import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Upload, Star, TrendingUp, Users, Target, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">CareerMentor</span>
          </div>
          <Button variant="outline" asChild>
            <Link href="/upload">Começar Análise</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            Mentoria Inteligente para Carreira em TI
          </Badge>

          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight text-balance">
            Acelere Sua Carreira em TI com <span className="text-primary">Mentoria Personalizada</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            Análise profissional do seu perfil, roadmaps personalizados e coaching com IA para impulsionar sua carreira
            em tecnologia
          </p>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold group"
            asChild
          >
            <Link href="/upload">
              Analisar Meu Perfil Gratuitamente
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-foreground mb-4">
              Mais de 2.500+ profissionais já aceleraram suas carreiras
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                  />
                ))}
              </div>
              <div className="flex items-center space-x-1 ml-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-muted-foreground ml-2">(4.8/5)</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-primary mb-2">85%</div>
              <p className="text-muted-foreground">Conseguiram promoção em 6 meses</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-primary mb-2">3.2x</div>
              <p className="text-muted-foreground">Aumento médio salarial</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-primary mb-2">30 dias</div>
              <p className="text-muted-foreground">Tempo médio para primeira oportunidade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">Como Funciona Nossa Mentoria</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Processo estruturado e baseado em dados para acelerar sua carreira em tecnologia
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-3">Análise do Perfil</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Upload do currículo para análise completa de skills e experiência
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-3">Roadmap Personalizado</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Plano de carreira customizado com metas e cronograma realista
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-3">Coach com IA</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Suporte contínuo com coaching inteligente e feedback personalizado
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-3">Acompanhamento</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Monitoramento de progresso e ajustes contínuos no plano
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
              asChild
            >
              <Link href="/upload">Começar Minha Análise Agora</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-foreground mb-4">Histórias de Sucesso</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "Em 4 meses consegui minha primeira vaga como desenvolvedora. O roadmap personalizado foi fundamental
                  para focar nos skills certos."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Maria Silva</p>
                    <p className="text-sm text-muted-foreground">Designer → Frontend Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "O coach IA me ajudou a identificar gaps que eu nem sabia que tinha. Hoje sou tech lead com 150% de
                  aumento salarial."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">C</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Carlos Santos</p>
                    <p className="text-sm text-muted-foreground">Analista → Tech Lead</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">CareerMentor</span>
          </div>
          <p className="text-muted max-w-md mx-auto">
            Acelerando carreiras em tecnologia através de mentoria inteligente e personalizada
          </p>
        </div>
      </footer>
    </div>
  )
}
