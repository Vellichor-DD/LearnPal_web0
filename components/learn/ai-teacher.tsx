"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, MessageCircle, FileText, Send, History } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "ai"
  content: string
}

const sampleMessages: Message[] = [
  { role: "user", content: "API and SDK have what differences" },
  { role: "ai", content: "API is an application programming interface that defines how software components interact. SDK is a software development kit that includes APIs along with tools, documentation and sample code for development." },
  { role: "ai", content: "Based on your notes, I want to ask you a question: Please explain what RAG technology is and how it helps improve the output quality of large language models." }
]

export function AITeacher() {
  const [mode, setMode] = useState<"ask" | "review">("ask")
  const [inputValue, setInputValue] = useState("")
  const [messages] = useState<Message[]>(sampleMessages)

  const handleSend = () => {
    if (!inputValue.trim()) return
    console.log("[v0] Send message:", inputValue)
    alert("You said: " + inputValue)
    setInputValue("")
  }

  const handleViewHistory = () => {
    console.log("[v0] View history")
    alert("Opening history...")
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <Card className="flex-1 border-border/50 bg-card/80 backdrop-blur-sm flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-5 w-5 text-primary" />
            AI老师
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <Button
              variant={mode === "ask" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("ask")
                console.log("[v0] Switch to ask mode")
              }}
              className="flex-1 gap-1.5"
            >
              <MessageCircle className="h-4 w-4" />
              提问老师
            </Button>
            <Button
              variant={mode === "review" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("review")
                console.log("[v0] Switch to review mode")
              }}
              className="flex-1 gap-1.5"
            >
              <FileText className="h-4 w-4" />
              复习模式
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={mode === "ask" ? "Ask AI teacher..." : "Answer review question..."}
              className="flex-1 rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <Button 
              size="icon" 
              className="rounded-full shrink-0"
              onClick={handleSend}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button 
        variant="outline" 
        className="w-full gap-2"
        onClick={handleViewHistory}
      >
        <History className="h-4 w-4" />
        对话历史
      </Button>
    </div>
  )
}
