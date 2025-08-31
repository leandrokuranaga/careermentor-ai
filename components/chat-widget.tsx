"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Sou sua IA de carreira. Como posso ajudar?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const exampleQuestions = [
    "Estou com dificuldade em React",
    "Como melhorar meu portfólio?",
    "Vale a pena fazer bootcamp?",
    "Quanto tempo para conseguir emprego?",
  ]

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(content),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const getAIResponse = (question: string): string => {
    if (question.toLowerCase().includes("react")) {
      return "React pode ser desafiador no início! Recomendo focar nos fundamentos: componentes, props e state. No seu roadmap atual, você está no Mês 1-2, então sugiro dominar JavaScript ES6+ primeiro. Quer que eu indique recursos específicos?"
    }
    if (question.toLowerCase().includes("portfólio")) {
      return "Um bom portfólio deve mostrar 3-5 projetos que demonstrem suas habilidades. Com base no seu progresso, sugiro começar com projetos simples como landing pages responsivas. Posso te ajudar a planejar seus próximos projetos?"
    }
    if (question.toLowerCase().includes("bootcamp")) {
      return "Bootcamps podem acelerar o aprendizado, mas não são obrigatórios. Você já tem um roadmap personalizado aqui! O importante é consistência. Com seu ritmo atual de estudos, você está no caminho certo."
    }
    if (question.toLowerCase().includes("emprego") || question.toLowerCase().includes("tempo")) {
      return "Com base no seu perfil e dedicação atual, estimo 8-10 meses para estar pronto para vagas júnior. Você já completou 42% do roadmap - continue assim! O mercado está aquecido para Frontend Developers."
    }
    return "Ótima pergunta! Com base no seu roadmap atual em Frontend Development, posso te dar conselhos específicos. Você gostaria de saber mais sobre algum tópico específico do seu plano de estudos?"
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border-2 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">IA de Carreira</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-900 border border-slate-200"
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === "ai" && <Bot className="w-4 h-4 mt-0.5 text-primary" />}
                {message.sender === "user" && <User className="w-4 h-4 mt-0.5" />}
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Example Questions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 text-center">Exemplos de perguntas:</p>
            <div className="space-y-2">
              {exampleQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2 text-xs bg-transparent"
                  onClick={() => handleSendMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua pergunta..."
            onKeyPress={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                handleSendMessage(inputValue.trim())
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={() => inputValue.trim() && handleSendMessage(inputValue.trim())}
            disabled={!inputValue.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
