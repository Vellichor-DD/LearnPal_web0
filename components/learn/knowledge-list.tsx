"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle2, Circle, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface KnowledgeItem {
  id: string
  name: string
  importance: "精通" | "熟悉" | "了解"
  status: "completed" | "learning" | "pending"
}

interface KnowledgeListProps {
  items: KnowledgeItem[]
  currentId: string
  onSelect: (id: string) => void
}

const importanceColors = {
  "精通": "bg-red-100 text-red-700 border-red-200",
  "熟悉": "bg-amber-100 text-amber-700 border-amber-200",
  "了解": "bg-blue-100 text-blue-700 border-blue-200"
}

const statusConfig = {
  completed: { 
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    label: "已完成"
  },
  learning: { 
    icon: <PlayCircle className="h-4 w-4 text-blue-500" />,
    label: "学习中"
  },
  pending: { 
    icon: <Circle className="h-4 w-4 text-muted-foreground/50" />,
    label: "待学习"
  }
}

export function KnowledgeList({ items, currentId, onSelect }: KnowledgeListProps) {
  return (
    <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-5 w-5 text-primary" />
          学习路径
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              console.log(`[v0] 选择知识点: ${item.name}`)
              onSelect(item.id)
            }}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50",
              currentId === item.id 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-transparent"
            )}
          >
            {/* 状态图标 */}
            <div className="flex-shrink-0">
              {statusConfig[item.status].icon}
            </div>
            
            {/* 主内容 */}
            <div className="min-w-0 flex-1">
              <p className={cn(
                "text-sm font-medium truncate",
                currentId === item.id ? "text-primary" : "text-foreground"
              )}>
                {item.name}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-xs font-medium",
                  importanceColors[item.importance]
                )}>
                  {item.importance}
                </span>
                <span className={cn(
                  "text-xs",
                  item.status === "completed" ? "text-green-600" :
                  item.status === "learning" ? "text-blue-600" : "text-muted-foreground"
                )}>
                  {statusConfig[item.status].label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
