"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, MessageCircle, FileText, Send, History, Maximize2, Minimize2 } from "lucide-react"
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
  const [isMaximized, setIsMaximized] = useState(false)

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
    <div className={cn("flex flex-col gap-4", isMaximized ? "fixed inset-4 z-50" : "h-full")}>
      <Card className={cn("flex-1 border-border/50 bg-card/80 backdrop-blur-sm flex flex-col", isMaximized && "bg-background/95")}>
        <CardHeader className="pb-3 shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-5 w-5 text-primary" />
              AI老师
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "恢复" : "最大化"}
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
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
        <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden min-h-0">
          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="space-y-3">
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
          </ScrollArea>

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
