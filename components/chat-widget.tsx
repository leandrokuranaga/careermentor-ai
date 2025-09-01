"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Loader2, Copy as CopyIcon, Check as CheckIcon } from "lucide-react"
import { chatPost } from "@/lib/api"
import type { ChatMessage } from "@/lib/types"

// ---------- Helpers & Subcomponents (module scope) ----------
type Block = { type: "text"; content: string } | { type: "code"; language: string; content: string }

const strHash = (s: string): string => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return "k" + Math.abs(h).toString(36)
}

const parseBlocks = (input: string): Block[] => {
  const blocks: Block[] = []
  const regex = /```(\w+)?\n([\s\S]*?)\n```/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(input)) !== null) {
    const [full, lang, code] = match
    if (match.index > lastIndex) {
      blocks.push({ type: "text", content: input.slice(lastIndex, match.index) })
    }
    blocks.push({ type: "code", language: (lang || "code").toLowerCase(), content: code })
    lastIndex = match.index + full.length
  }
  if (lastIndex < input.length) {
    blocks.push({ type: "text", content: input.slice(lastIndex) })
  }
  return blocks
}

const formatReadable = (text: string) => {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/([.!?])(\s+)(?=[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ0-9])/g, "$1\n\n")

  const paragraphs = normalized.split(/\n\n+/)
  return (
    <div className="text-sm whitespace-pre-wrap leading-6">
      {paragraphs.map((p) => {
        const key = strHash(p)
        const parts = p.split(/`([^`]+)`/g)
        return (
          <p key={key} className="mb-3 last:mb-0">
            {parts.map((part, idx) => {
              const k = strHash(idx + ":" + part)
              return idx % 2 === 1 ? (
                <code key={k} className="px-1 py-0.5 rounded bg-slate-200 text-slate-900">{part}</code>
              ) : (
                <span key={k}>{part}</span>
              )
            })}
          </p>
        )
      })}
    </div>
  )
}

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }
  const langLabel = language.toUpperCase()
  return (
    <div className="my-3 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 text-xs bg-slate-100 text-slate-600 border-b border-slate-200">
        <span>{langLabel}</span>
        <button onClick={handleCopy} className="flex items-center space-x-1 hover:opacity-80">
          {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
          <span>{copied ? "Copiado" : "Copiar"}</span>
        </button>
      </div>
      <pre className="p-3 overflow-auto text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const RenderMessageContent = ({ content }: { content: string }) => {
  const blocks = parseBlocks(content)
  return (
    <div>
      {blocks.map((b) =>
        b.type === "code" ? (
          <CodeBlock key={`code-${strHash(b.language + "|" + b.content)}`} language={b.language} code={b.content} />
        ) : (
          <div key={`text-${strHash(b.content)}`}>{formatReadable(b.content)}</div>
        ),
      )}
    </div>
  )
}

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
  content: "Olá! Sou seu assistente de carreira em tecnologia. Como posso ajudar você hoje?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages, loading state changes, or when opening
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading, isOpen])

  const exampleQuestions = [
    "Quais próximos passos para migrar para backend .NET em 3 meses?",
    "Como montar um portfólio simples para vagas júnior?",
    "Dicas para entrevistas técnicas de JavaScript?",
    "Qual roadmap para aprender Docker e Azure?",
  ]

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
  setIsLoading(true)

    try {
      // Convert messages to ChatMessage format
      const chatMessages: ChatMessage[] = [...messages, userMessage].map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content
      }))

      const response = await chatPost({ messages: chatMessages })
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Desculpe, houve um erro ao processar sua mensagem. Tente novamente."
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: msg,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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
          <span className="font-semibold">Assistente IA</span>
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
                <RenderMessageContent content={message.content} />
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
              <div className="flex items-center space-x-2 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Escrevendo…</span>
              </div>
            </div>
          </div>
        )}

  {/* Scroll sentinel */}
  <div ref={messagesEndRef} />

        {/* Example Questions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 text-center">Exemplos de perguntas:</p>
            <div className="space-y-2">
        {exampleQuestions.map((question) => (
                <Button
          key={question}
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
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && inputValue.trim() && !isLoading) {
                handleSendMessage(inputValue.trim())
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={() => inputValue.trim() && !isLoading && handleSendMessage(inputValue.trim())}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
