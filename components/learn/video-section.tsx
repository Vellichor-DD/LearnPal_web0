"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Sparkles, 
  Save, 
  Upload, 
  Link as LinkIcon,
  Plus,
  ExternalLink,
  Pencil,
  Check,
  X,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoSectionProps {
  knowledgeTitle: string
}

interface CourseLink {
  id: string
  title: string
  url: string
  type: "recommended" | "custom"
}

const initialLinks: CourseLink[] = [
  { id: "1", title: "【B站】API基础入门讲解", url: "https://bilibili.com", type: "recommended" },
  { id: "2", title: "【YouTube】RAG技术详解", url: "https://youtube.com", type: "recommended" },
  { id: "3", title: "【官方文档】OpenAI API Guide", url: "https://openai.com", type: "recommended" },
  { id: "4", title: "我的收藏视频", url: "https://example.com", type: "custom" }
]

const sampleNotes = `## 核心概念
- **API (Application Programming Interface)**: 应用程序接口，是软件系统之间进行数据交互的桥梁
- **RAG (Retrieval-Augmented Generation)**: 检索增强生成，结合检索系统和生成模型的AI技术

## 关键方法
1. 理解API的请求-响应模型
2. 掌握RESTful API设计原则
3. 学会使用RAG优化大模型输出

## 重点难点
- API调用的错误处理机制
- RAG中向量数据库的选择与使用
- 如何评估RAG系统的效果`

export function VideoSection({ knowledgeTitle }: VideoSectionProps) {
  const [courseType, setCourseType] = useState<"speed" | "detailed">("speed")
  const [links, setLinks] = useState<CourseLink[]>(initialLinks)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLinkTitle, setNewLinkTitle] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")

  const handleUpload = () => {
    console.log("[v0] 上传素材")
    alert("正在打开文件选择器...")
  }

  const handleAIOrganize = () => {
    console.log("[v0] AI整理笔记")
    alert("AI正在整理你的笔记...")
  }

  const handleSave = () => {
    console.log("[v0] 保存笔记")
    alert("笔记已保存！")
  }

  const handleOpenLink = (link: CourseLink) => {
    console.log(`[v0] 打开链接: ${link.title} - ${link.url}`)
    window.open(link.url, "_blank")
  }

  const startEditing = (link: CourseLink) => {
    setEditingId(link.id)
    setEditingTitle(link.title)
  }

  const saveEditing = () => {
    if (editingId && editingTitle.trim()) {
      setLinks(links.map(l => 
        l.id === editingId ? { ...l, title: editingTitle.trim() } : l
      ))
      console.log(`[v0] 更新链接标题: ${editingTitle}`)
    }
    setEditingId(null)
    setEditingTitle("")
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingTitle("")
  }

  const deleteLink = (id: string) => {
    const link = links.find(l => l.id === id)
    console.log(`[v0] 删除链接: ${link?.title}`)
    setLinks(links.filter(l => l.id !== id))
  }

  const addNewLink = () => {
    if (newLinkTitle.trim() && newLinkUrl.trim()) {
      const newLink: CourseLink = {
        id: Date.now().toString(),
        title: newLinkTitle.trim(),
        url: newLinkUrl.trim(),
        type: "custom"
      }
      setLinks([...links, newLink])
      console.log(`[v0] 添加自定义链接: ${newLinkTitle}`)
      setNewLinkTitle("")
      setNewLinkUrl("")
      setShowAddForm(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* 课程链接区域 - 1/4高度 */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm flex flex-col" style={{ flex: "0 0 25%" }}>
        <CardHeader className="py-2 px-3 shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <LinkIcon className="h-4 w-4 text-primary" />
              课程链接
            </CardTitle>
            {/* 课程类型切换按钮 */}
            <div className="flex gap-1">
              <Button
                variant={courseType === "speed" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCourseType("speed")
                  console.log("[v0] 切换到速通课")
                }}
                className="h-6 px-2 text-xs"
              >
                速通课
              </Button>
              <Button
                variant={courseType === "detailed" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCourseType("detailed")
                  console.log("[v0] 切换到详细课")
                }}
                className="h-6 px-2 text-xs"
              >
                详细课
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground -mt-0.5">
            {courseType === "speed" ? "速通课" : "详细课"} - {knowledgeTitle}
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-0.5 px-3 pb-2 pt-0 min-h-0">
          {/* 链接列表 - 可滚动区域 */}
          <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
          {links.map((link) => (
            <div
              key={link.id}
              className="group flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 transition-all hover:border-border hover:bg-muted/30"
            >
              {editingId === link.id ? (
                <>
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="h-7 flex-1 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditing()
                      if (e.key === "Escape") cancelEditing()
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveEditing}>
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelEditing}>
                    <X className="h-3.5 w-3.5 text-red-600" />
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleOpenLink(link)}
                    className="flex flex-1 items-center gap-2 text-left text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{link.title}</span>
                  </button>
                  <span className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                    link.type === "recommended" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-green-100 text-green-700"
                  )}>
                    {link.type === "recommended" ? "推荐" : "自定义"}
                  </span>
                  <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7"
                      onClick={() => startEditing(link)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-red-600 hover:text-red-700"
                      onClick={() => deleteLink(link.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
          </div>

          {/* 添加自定义链接 - 固定在底部 */}
          <div className="shrink-0 pt-1 border-t border-border/30">
            {showAddForm ? (
              <div className="space-y-1.5 rounded-md border border-dashed border-border p-2">
                <Input
                  placeholder="链接标题"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="h-7 text-xs"
                />
                <Input
                  placeholder="链接URL"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="h-7 text-xs"
                />
                <div className="flex gap-1.5">
                  <Button size="sm" className="flex-1 h-7 text-xs" onClick={addNewLink}>
                    添加
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => setShowAddForm(false)}>
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full h-7 gap-1 text-xs border border-dashed"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                添加自定义链接
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 笔记区域 - 3/4高度 */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm flex flex-col" style={{ flex: "1 1 75%" }}>
        <CardHeader className="pb-3 shrink-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            学习笔记
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 min-h-0">
          {/* 笔记内容 */}
          <div className="flex-1 overflow-y-auto rounded-lg bg-muted/50 p-3 min-h-0">
            <div className="prose prose-sm max-w-none text-foreground">
              {sampleNotes.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return <h3 key={i} className="mt-3 first:mt-0 mb-2 text-sm font-semibold text-foreground">{line.replace('## ', '')}</h3>
                }
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
                  if (match) {
                    return (
                      <p key={i} className="mb-1 text-sm">
                        <strong className="text-foreground">{match[1]}</strong>
                        <span className="text-muted-foreground">: {match[2]}</span>
                      </p>
                    )
                  }
                }
                if (line.match(/^\d\./)) {
                  return <p key={i} className="mb-1 text-sm text-muted-foreground">{line}</p>
                }
                if (line.startsWith('- ')) {
                  return <p key={i} className="mb-1 text-sm text-muted-foreground">{line}</p>
                }
                return null
              })}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleUpload}>
              <Upload className="h-4 w-4" />
              上传素材
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleAIOrganize}>
              <Sparkles className="h-4 w-4" />
              AI整理
            </Button>
            <Button size="sm" className="flex-1 gap-1.5" onClick={handleSave}>
              <Save className="h-4 w-4" />
              保存笔记
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
