"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Play } from "lucide-react"

interface LearningCardProps {
  title: string
  image: string
  progress: number
  onStartLearning: () => void
  onReviewTalk: () => void
}

export function LearningCard({ 
  title, 
  image, 
  progress, 
  onStartLearning, 
  onReviewTalk 
}: LearningCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
      onClick={onStartLearning}
    >
      <CardContent className="p-0">
        {/* 图片区域 - 带进度渐变效果 */}
        <div className="relative h-40 w-full overflow-hidden">
          {/* 灰度底层图片 */}
          <img 
            src={image} 
            alt={title}
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
          
          {/* 彩色层 - 使用 clip-path 裁剪显示左侧部分 */}
          <img 
            src={image} 
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ 
              clipPath: `inset(0 ${100 - progress}% 0 0)` 
            }}
          />
          
          {/* 进度分隔线 */}
          {progress > 0 && progress < 100 && (
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-lg shadow-white/50"
              style={{ left: `${progress}%` }}
            />
          )}
          
          {/* 进度百分比覆盖层 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Play className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              {progress}%
            </span>
          </div>
          
          {/* 右上角进度徽章 */}
          <div className="absolute right-3 top-3">
            <div className={`rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
              progress === 0 
                ? "bg-muted/80 text-muted-foreground" 
                : progress === 100 
                  ? "bg-green-500/80 text-white" 
                  : "bg-blue-500/80 text-white"
            }`}>
              {progress === 0 ? "未开始" : progress === 100 ? "已完成" : "学习中"}
            </div>
          </div>
        </div>
        
        {/* 卡片内容 */}
        <div className="p-4">
          <h3 className="mb-3 text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* 进度条 */}
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* 复习Talk按钮 */}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            onClick={(e) => {
              e.stopPropagation()
              onReviewTalk()
            }}
          >
            <MessageCircle className="h-4 w-4" />
            复习Talk
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
