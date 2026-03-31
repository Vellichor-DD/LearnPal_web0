"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Crown,
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  StickyNote,
  Trophy,
  Target,
  BookOpen,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== 类型定义 ====================

interface Message {
  id: string
  role: "ai" | "user"
  content: string
  type?: "welcome" | "question" | "feedback" | "finish"
  questionId?: string
  showAddNote?: boolean
}

interface Question {
  id: string
  question: string
  keyPoints: string[]
  knowledgePoint: string
}

interface ReviewState {
  currentRound: number
  totalRounds: number
  correctCount: number
  answeredCount: number
  isStarted: boolean
  isFinished: boolean
  addedToNotes: string[] // 已添加到笔记的题目ID
}

// ==================== 模拟数据 ====================

const courseData: Record<string, { title: string; knowledgePoints: string[] }> = {
  "1": {
    title: "转行AI产品经理",
    knowledgePoints: ["AI产品经理入门", "机器学习基础", "大模型原理与应用"]
  },
  "2": {
    title: "Python爬虫实战",
    knowledgePoints: ["HTTP协议基础", "Requests库使用", "XPath解析"]
  },
  "3": {
    title: "数据分析入门",
    knowledgePoints: ["数据清洗", "Excel高级技巧", "数据可视化基础"]
  }
}

const questionBank: Record<string, Question[]> = {
  "1": [
    {
      id: "q1",
      question: "AI产品经理和传统产品经理的核心区别是什么？",
      keyPoints: ["技术理解深度", "模型评估能力", "提示词工程"],
      knowledgePoint: "AI产品经理入门"
    },
    {
      id: "q2",
      question: "监督学习和无监督学习的主要区别是什么？",
      keyPoints: ["有无标签数据", "目标不同"],
      knowledgePoint: "机器学习基础"
    },
    {
      id: "q3",
      question: "大模型推理时，温度和top_p参数分别控制什么？",
      keyPoints: ["温度控制随机性", "top_p控制候选词范围"],
      knowledgePoint: "大模型原理与应用"
    }
  ],
  "2": [
    {
      id: "q1",
      question: "HTTP协议中GET和POST请求的主要区别是什么？",
      keyPoints: ["GET用于获取数据", "POST用于提交数据", "GET参数在URL中"],
      knowledgePoint: "HTTP协议基础"
    },
    {
      id: "q2",
      question: "Requests库中如何处理请求头(headers)？",
      keyPoints: ["headers参数", "字典格式", "User-Agent设置"],
      knowledgePoint: "Requests库使用"
    }
  ],
  "3": [
    {
      id: "q1",
      question: "数据清洗的主要步骤有哪些？",
      keyPoints: ["处理缺失值", "去除重复数据", "格式统一"],
      knowledgePoint: "数据清洗"
    }
  ]
}

// ==================== 辅助函数 ====================

/**
 * 评估用户回答
 * 简单的关键词匹配逻辑
 */
function evaluateAnswer(userAnswer: string, keyPoints: string[]): boolean {
  const normalizedAnswer = userAnswer.toLowerCase()
  // 如果答案包含至少一个关键词，认为回答基本正确
  return keyPoints.some(point => 
    normalizedAnswer.includes(point.toLowerCase().slice(0, 4))
  )
}

/**
 * 生成AI反馈消息
 */
function generateFeedback(
  isCorrect: boolean, 
  keyPoints: string[], 
  userAnswer: string,
  questionId: string,
  alreadyAdded: boolean
): { content: string; showAddNote: boolean } {
  if (isCorrect) {
    return {
      content: `✅ **回答正确！**\n\n你的回答很好地涵盖了核心要点。\n\n**标准答案要点：**\n${keyPoints.map(p => `• ${p}`).join('\n')}\n\n继续加油，准备下一题！ 💪`,
      showAddNote: false
    }
  } else {
    const showAddNote = !alreadyAdded
    return {
      content: `⚠️ **回答还可以更完善**\n\n你的回答包含了一些正确的内容，但缺少以下关键要点：\n\n**遗漏的要点：**\n${keyPoints.map(p => `• ${p}`).join('\n')}\n\n建议回顾一下这个知识点的相关内容。${showAddNote ? '\n\n点击下方「📝 补充笔记」按钮，将遗漏的知识点添加到笔记中。' : ''}`,
      showAddNote
    }
  }
}

// ==================== 主组件 ====================

export default function ReviewTalkPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const course = courseData[courseId] || { title: "未知课程", knowledgePoints: [] }
  const questions = questionBank[courseId] || []
  
  // 滚动区域引用
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [reviewState, setReviewState] = useState<ReviewState>({
    currentRound: 0,
    totalRounds: questions.length,
    correctCount: 0,
    answeredCount: 0,
    isStarted: false,
    isFinished: false,
    addedToNotes: []
  })
  
  // 模拟用户数据
  const isMember = true
  const dailyReviewCount = 1
  const maxDailyReviews = 3

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // ==================== 事件处理 ====================

  /**
   * 返回主界面
   */
  const handleBack = () => {
    if (confirm("确定要退出复习吗？当前进度将不会保存。")) {
      router.push("/")
    }
  }

  /**
   * 开始复习
   */
  const handleStartReview = () => {
    setReviewState(prev => ({ ...prev, isStarted: true }))
    
    // AI发送第一题
    const firstQuestion = questions[0]
    const aiMessage: Message = {
      id: Date.now().toString(),
      role: "ai",
      content: `**第1题：** ${firstQuestion.question}`,
      type: "question",
      questionId: firstQuestion.id
    }
    setMessages([aiMessage])
  }

  /**
   * 发送消息
   */
  const handleSend = () => {
    if (!inputValue.trim() || !reviewState.isStarted || reviewState.isFinished) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim()
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // 处理用户回答
    processUserAnswer(inputValue.trim())
    setInputValue("")
  }

  /**
   * 处理用户回答
   */
  const processUserAnswer = (answer: string) => {
    const currentQuestion = questions[reviewState.currentRound]
    const isCorrect = evaluateAnswer(answer, currentQuestion.keyPoints)
    
    // 更新统计
    const newState = {
      ...reviewState,
      answeredCount: reviewState.answeredCount + 1,
      correctCount: isCorrect ? reviewState.correctCount + 1 : reviewState.correctCount
    }
    
    // 生成反馈
    const alreadyAdded = reviewState.addedToNotes.includes(currentQuestion.id)
    const feedback = generateFeedback(
      isCorrect, 
      currentQuestion.keyPoints, 
      answer,
      currentQuestion.id,
      alreadyAdded
    )
    
    const feedbackMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: feedback.content,
      type: "feedback",
      questionId: currentQuestion.id,
      showAddNote: feedback.showAddNote
    }
    
    setMessages(prev => [...prev, feedbackMessage])
    
    // 检查是否还有下一题
    if (newState.currentRound + 1 < newState.totalRounds) {
      // 延迟发送下一题
      setTimeout(() => {
        const nextQuestion = questions[newState.currentRound + 1]
        const nextMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "ai",
          content: `**第${newState.currentRound + 2}题：** ${nextQuestion.question}`,
          type: "question",
          questionId: nextQuestion.id
        }
        setMessages(prev => [...prev, nextMessage])
      }, 1500)
      
      newState.currentRound += 1
    } else {
      // 复习完成
      setTimeout(() => {
        handleFinishReview(newState.correctCount, newState.totalRounds)
      }, 2000)
    }
    
    setReviewState(newState)
  }

  /**
   * 补充笔记
   */
  const handleAddToNotes = (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return
    
    // 标记已添加
    setReviewState(prev => ({
      ...prev,
      addedToNotes: [...prev.addedToNotes, questionId]
    }))
    
    // 显示确认消息
    alert(`✅ 已添加到笔记草稿\n\n知识点：${question.knowledgePoint}\n\n你可以在笔记页继续完善内容。`)
    
    // 更新消息状态，隐藏补充笔记按钮
    setMessages(prev => prev.map(msg => 
      msg.questionId === questionId && msg.type === "feedback"
        ? { ...msg, showAddNote: false }
        : msg
    ))
  }

  /**
   * 完成复习
   */
  const handleFinishReview = (correct: number, total: number) => {
    const accuracy = Math.round((correct / total) * 100)
    
    const finishMessage: Message = {
      id: Date.now().toString(),
      role: "ai",
      content: `🎉 **复习完成！**\n\n**本次复习统计：**\n• 正确率：${accuracy}%\n• 答对题数：${correct}/${total}\n\n${accuracy >= 80 ? "太棒了！掌握得很扎实，继续保持！🏆" : accuracy >= 60 ? "还不错！建议针对错题再复习一下。📚" : "还需要加强练习哦，多复习几遍会更好！💪"}\n\n点击下方「✅ 完成复习」按钮返回主界面。`,
      type: "finish"
    }
    
    setMessages(prev => [...prev, finishMessage])
    setReviewState(prev => ({ ...prev, isFinished: true }))
  }

  /**
   * 计算正确率
   */
  const getAccuracy = () => {
    if (reviewState.answeredCount === 0) return 0
    return Math.round((reviewState.correctCount / reviewState.answeredCount) * 100)
  }

  // ==================== 渲染 ====================

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#eef2f6]">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* 左侧 - 返回按钮 */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1.5"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>

          {/* 中间 - 任务名称 */}
          <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Target className="h-5 w-5 text-primary" />
            {course.title} · 复习Talk
          </h1>

          {/* 右侧 - 用户头像和会员标识 */}
          <div className="flex items-center gap-2">
            {isMember && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                <Crown className="mr-1 h-3 w-3" />
                会员
              </Badge>
            )}
            <Avatar className="h-8 w-8">
              <AvatarImage src="/images/avatar.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto max-w-4xl px-4 py-6">
        {/* 复习状态卡片 */}
        <Card className="mb-6 border-border/50 bg-white/80 backdrop-blur-sm shadow-sm">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* 复习范围 */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">复习范围</p>
                  <p className="text-sm font-medium text-foreground">
                    已学{course.knowledgePoints.length}个知识点
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {course.knowledgePoints.join("、")}
                  </p>
                </div>
              </div>

              {/* 复习进度 */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">复习进度</p>
                  <p className="text-sm font-medium text-foreground">
                    第 {reviewState.isStarted ? reviewState.currentRound + 1 : 0} 题 / 共 {reviewState.totalRounds} 题
                  </p>
                  <Progress 
                    value={((reviewState.currentRound + (reviewState.isStarted ? 1 : 0)) / reviewState.totalRounds) * 100} 
                    className="mt-1.5 h-1.5"
                  />
                </div>
              </div>

              {/* 本轮正确率 */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">本轮正确率</p>
                  <p className="text-2xl font-bold text-foreground">
                    {getAccuracy()}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {reviewState.correctCount}/{reviewState.answeredCount} 正确
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 聊天对话区 */}
        <Card className="border-border/50 bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="border-b border-border/30 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-primary" />
              AI复习助手
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* 消息列表 */}
            <ScrollArea 
              ref={scrollRef}
              className="h-[400px] px-4 py-4"
            >
              {messages.length === 0 ? (
                // 欢迎状态
                <div className="flex h-full flex-col items-center justify-center space-y-4 py-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">
                      嗨！我是你的复习助手 👋
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      本次复习涵盖以下知识点：
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {course.knowledgePoints.map((point, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="max-w-sm text-center text-xs text-muted-foreground">
                    <p className="mb-2">📋 <strong>复习规则：</strong></p>
                    <p>AI会依次提问，根据你的回答判断掌握程度。不完整的地方可以帮你补充笔记。</p>
                  </div>
                  <Button 
                    size="lg" 
                    className="gap-2 mt-4"
                    onClick={handleStartReview}
                  >
                    <Sparkles className="h-4 w-4" />
                    开始复习
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {/* AI头像 */}
                      {message.role === "ai" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      {/* 消息气泡 */}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        )}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
                        
                        {/* 补充笔记按钮 */}
                        {message.showAddNote && message.questionId && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="mt-3 gap-1.5 h-8 bg-amber-100 text-amber-700 hover:bg-amber-200 border-0"
                            onClick={() => handleAddToNotes(message.questionId!)}
                          >
                            <StickyNote className="h-3.5 w-3.5" />
                            补充笔记
                          </Button>
                        )}
                      </div>
                      
                      {/* 用户头像 */}
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-muted">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* 输入区域 */}
            <div className="border-t border-border/30 p-4">
              {!reviewState.isFinished ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={
                      reviewState.isStarted 
                        ? "输入你的回答..." 
                        : "点击「开始复习」按钮开始答题"
                    }
                    disabled={!reviewState.isStarted}
                    className="flex-1 rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button 
                    size="icon" 
                    className="rounded-full shrink-0"
                    onClick={handleSend}
                    disabled={!reviewState.isStarted || !inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full gap-2"
                  onClick={() => router.push("/")}
                >
                  <Trophy className="h-4 w-4" />
                  完成复习
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* 底部会员限制提示 */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/40 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-12 items-center justify-center px-4">
          {isMember ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Crown className="h-4 w-4 text-amber-500" />
              <span>会员用户 · 不限次数</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>每日复习次数 {dailyReviewCount}/{maxDailyReviews}</span>
            </div>
          )}
        </div>
      </footer>

      {/* 底部留白，避免被固定footer遮挡 */}
      <div className="h-12" />
    </div>
  )
}
