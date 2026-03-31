"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { LearningCard } from "@/components/learning-card"
import { ChatPanel } from "@/components/chat-panel"
import { BookOpen } from "lucide-react"

const learningTasks = [
  {
    id: "1",
    title: "转行AI产品经理",
    image: "/images/ai-product-manager.jpg",
    progress: 60
  },
  {
    id: "2",
    title: "Python爬虫实战",
    image: "/images/python-crawler.jpg",
    progress: 30
  },
  {
    id: "3",
    title: "数据分析入门",
    image: "/images/data-analysis.jpg",
    progress: 0
  }
]

export default function HomePage() {
  const router = useRouter()

  const handleStartLearning = (taskId: string, taskTitle: string) => {
    console.log(`[v0] 开始学习: ${taskTitle}`)
    router.push(`/learn/${taskId}`)
  }

  const handleReviewTalk = (taskId: string, taskTitle: string) => {
    console.log(`[v0] 进入复习Talk: ${taskTitle}`)
    router.push(`/review/${taskId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navbar isMember={true} />
      
      {/* 主内容区 */}
      <main className="container mx-auto px-4 pb-64 pt-8">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            继续学习
          </h1>
          <p className="text-muted-foreground">
            每天进步一点点，成就更好的自己
          </p>
        </div>

        {/* 学习任务卡片区 */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">我的学习计划</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {learningTasks.length}个任务
            </span>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningTasks.map((task) => (
              <LearningCard
                key={task.id}
                title={task.title}
                image={task.image}
                progress={task.progress}
                onStartLearning={() => handleStartLearning(task.id, task.title)}
                onReviewTalk={() => handleReviewTalk(task.id, task.title)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* 底部聊天区 */}
      <ChatPanel />
    </div>
  )
}
