"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { KnowledgeList } from "@/components/learn/knowledge-list"
import { VideoSection } from "@/components/learn/video-section"
import { AITeacher } from "@/components/learn/ai-teacher"
import { ArrowLeft, Flame, Crown, CheckCircle2 } from "lucide-react"

// 模拟课程数据
const courseData: Record<string, { title: string }> = {
  "1": { title: "转行AI产品经理" },
  "2": { title: "Python爬虫实战" },
  "3": { title: "数据分析入门" }
}

// 模拟知识点数据
const knowledgeItems = [
  { id: "k1", name: "AI产品经理入门", importance: "精通" as const, status: "completed" as const },
  { id: "k2", name: "技术基础(API/RAG)", importance: "了解" as const, status: "learning" as const },
  { id: "k3", name: "市场需求分析", importance: "熟悉" as const, status: "pending" as const },
  { id: "k4", name: "竞品分析", importance: "精通" as const, status: "pending" as const },
  { id: "k5", name: "PRD撰写", importance: "精通" as const, status: "pending" as const }
]

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const course = courseData[courseId] || { title: "未知课程" }
  
  const [currentKnowledgeId, setCurrentKnowledgeId] = useState("k2")
  const currentKnowledge = knowledgeItems.find(k => k.id === currentKnowledgeId)
  
  const completedCount = knowledgeItems.filter(k => k.status === "completed").length

  const handleBack = () => {
    console.log("[v0] 返回首页")
    router.push("/")
  }

  const handleCheckIn = () => {
    console.log("[v0] 今日打卡")
    alert("打卡成功！继续保持！")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/30">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* 左侧 - 返回按钮 */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1.5"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Button>

          {/* 中间 - 课程名称 */}
          <h1 className="text-lg font-semibold text-foreground">
            {course.title}
          </h1>

          {/* 右侧 - 打卡天数 + 会员 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium">连续打卡3天</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1">
              <Crown className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">会员</span>
            </div>
          </div>
        </div>
      </header>

      {/* 三栏布局主体 */}
      <main className="container mx-auto flex-1 px-4 py-6">
        <div className="grid h-[calc(100vh-180px)] gap-6" style={{ gridTemplateColumns: "1fr 2fr 1.5fr" }}>
          {/* 左侧 - 知识点列表 */}
          <div className="overflow-auto">
            <KnowledgeList
              items={knowledgeItems}
              currentId={currentKnowledgeId}
              onSelect={setCurrentKnowledgeId}
            />
          </div>

          {/* 中间 - 视频 + 笔记 */}
          <div className="overflow-auto">
            <VideoSection knowledgeTitle={currentKnowledge?.name || ""} />
          </div>

          {/* 右侧 - AI助手 */}
          <div className="overflow-auto">
            <AITeacher />
          </div>
        </div>
      </main>

      {/* 底部打卡区 */}
      <footer className="sticky bottom-0 border-t border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>进度：</span>
            <span className="font-medium text-foreground">{completedCount}/{knowledgeItems.length}</span>
            <span>知识点完成</span>
          </div>
          <Button 
            className="gap-2"
            onClick={handleCheckIn}
          >
            <CheckCircle2 className="h-4 w-4" />
            今日打卡
          </Button>
        </div>
      </footer>
    </div>
  )
}
