"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "你好！我是你的AI学习规划师，告诉我你想学什么，我来帮你规划最适合的学习路径 🎯"
  },
  {
    id: "2",
    role: "user",
    content: "我想转行做AI产品经理，应该从哪里开始？"
  },
  {
    id: "3",
    role: "assistant",
    content: "太棒了！转行AI产品经理是个很好的选择。我建议你从三个方向入手：1️⃣ 产品基础知识 2️⃣ AI技术概念 3️⃣ 实际项目案例。我已经为你创建了「转行AI产品经理」学习计划，点击卡片开始学习吧！"
  }
]

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    }
    
    setMessages(prev => [...prev, newMessage])
    console.log("[v0] 用户发送消息:", input)
    alert(`已发送消息: ${input}\n\n（这里会调用AI生成学习计划）`)
    setInput("")
    
    // 模拟AI回复
    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "收到！我正在为你分析最佳学习路径，稍后会为你生成个性化的学习计划卡片 ✨"
      }
      setMessages(prev => [...prev, aiReply])
    }, 1000)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto max-w-4xl px-4 py-4">
        {/* 对话历史 */}
        <div className="mb-4 max-h-48 space-y-3 overflow-y-auto scrollbar-thin">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className={
                  message.role === "assistant" 
                    ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white" 
                    : "bg-muted text-muted-foreground"
                }>
                  {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-br-sm" 
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        
        {/* 输入区域 */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="输入你想学的内容，AI帮你规划学习路径..."
              className="h-12 rounded-full border-border/50 bg-muted/50 pl-5 pr-12 text-base placeholder:text-muted-foreground/70 focus-visible:ring-primary/50"
            />
            <Button
              size="icon"
              className="absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition-all"
              onClick={handleSend}
            >
              <Send className="h-4 w-4 text-white" />
              <span className="sr-only">发送消息</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
