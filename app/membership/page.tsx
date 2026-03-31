"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Crown,
  Star,
  Lock,
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  CreditCard,
  MessageCircle,
  BookOpen,
  History,
  FileText,
  TrendingUp,
  Flame,
  Award,
  Clock,
  AlertCircle,
  CheckCircle2,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== 类型定义 ====================

type MembershipLevel = "free" | "pro" | "ultra"

interface MembershipConfig {
  level: MembershipLevel
  name: string
  icon: React.ReactNode
  color: string
  bgColor: string
  price: {
    monthly: number
    yearly: number
    yearlySave: number
  }
}

// ==================== 配置数据 ====================

const MEMBERSHIP_CONFIG: Record<MembershipLevel, MembershipConfig> = {
  free: {
    level: "free",
    name: "免费用户",
    icon: <Lock className="h-4 w-4" />,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    price: { monthly: 0, yearly: 0, yearlySave: 0 }
  },
  pro: {
    level: "pro",
    name: "Pro会员",
    icon: <Star className="h-4 w-4" />,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    price: { monthly: 19, yearly: 169, yearlySave: 59 }
  },
  ultra: {
    level: "ultra",
    name: "Ultra会员",
    icon: <Crown className="h-4 w-4" />,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    price: { monthly: 49, yearly: 449, yearlySave: 139 }
  }
}

// 权益对比数据
const FEATURES_DATA = [
  {
    category: "学习任务",
    items: [
      { name: "进行中的任务数", free: "1个", pro: "5个", ultra: "无限个", highlight: true },
      { name: "每个任务知识点数", free: "最多10个", pro: "最多30个", ultra: "无限个", highlight: true },
    ]
  },
  {
    category: "笔记管理",
    items: [
      { name: "每个知识点笔记条数", free: "10条", pro: "50条", ultra: "无限条", highlight: true },
      { name: "图片/语音/文件上传", free: true, pro: true, ultra: true, highlight: false },
      { name: "笔记导出（PDF/Markdown）", free: false, pro: true, ultra: true, highlight: false },
      { name: "笔记多格式导出（含Word）", free: false, pro: false, ultra: true, highlight: true },
    ]
  },
  {
    category: "AI老师",
    items: [
      { name: "提问老师次数/日", free: "5次", pro: "50次", ultra: "无限次", highlight: true },
      { name: "复习模式次数/日", free: "3次", pro: "30次", ultra: "无限次", highlight: true },
      { name: "优先响应队列", free: false, pro: false, ultra: true, highlight: true },
    ]
  },
  {
    category: "视频资源",
    items: [
      { name: "系统推荐免费视频", free: true, pro: true, ultra: true, highlight: false },
      { name: "自定义添加视频链接", free: false, pro: true, ultra: true, highlight: false },
      { name: "备用链接自动切换", free: false, pro: false, ultra: true, highlight: true },
    ]
  },
  {
    category: "高级功能",
    items: [
      { name: "对话历史保留", free: "30天", pro: "1年", ultra: "永久", highlight: true },
      { name: "学习数据导出", free: false, pro: false, ultra: true, highlight: true },
      { name: "年度学习报告", free: false, pro: false, ultra: true, highlight: true },
      { name: "专属客服", free: false, pro: false, ultra: "微信/企微", highlight: true },
    ]
  }
]

// FAQ数据
const FAQ_DATA = [
  {
    question: "Pro和Ultra有什么区别？哪个更适合我？",
    answer: "Pro会员适合轻度学习用户，核心功能无限制，包括5个并行任务、50次/日AI对话等。Ultra会员适合重度学习用户，全部功能无限制，还享有优先AI响应、专属客服、年度报告等高级权益。如果你每天学习时间较长，建议选择Ultra。"
  },
  {
    question: "我可以从Pro升级到Ultra吗？费用怎么算？",
    answer: "当然可以！你可以随时从Pro升级到Ultra。升级时系统会自动计算剩余有效期，按剩余天数折算差价。例如：你还有3个月Pro有效期，升级Ultra只需支付差价部分。"
  },
  {
    question: "年付和月付有什么区别？可以随时取消吗？",
    answer: "年付相比月付平均每月更优惠（Pro省¥59，Ultra省¥139）。年付是一次性支付全年费用，月付是每月自动扣费。两种付费方式都可以随时取消，取消后有效期内仍可继续使用会员权益，到期后不再续费。"
  },
  {
    question: "学生有优惠吗？",
    answer: "有的！我们为学生提供教育优惠，Pro会员年付仅需¥99（原价¥169），Ultra会员年付仅需¥299（原价¥449）。请使用.edu邮箱注册或联系客服提供学生证验证。"
  },
  {
    question: "团队/企业购买怎么联系？",
    answer: "团队购买（5人以上）享有专属折扣。请联系我们的商务团队：business@learnpal.ai，或扫描页面底部二维码添加企业微信，我们会在24小时内回复。"
  }
]

// ==================== 主组件 ====================

export default function MembershipPage() {
  const router = useRouter()
  
  // 当前会员状态（可切换演示）
  const [currentLevel, setCurrentLevel] = useState<MembershipLevel>("free")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  
  // 模拟用户数据
  const userData = {
    name: "学习者",
    avatar: "/images/avatar.png",
    // 根据currentLevel动态计算有效期
    expiryDate: {
      free: null,
      pro: "2026-06-27",
      ultra: "2027-03-27"
    }[currentLevel],
    // 今日使用情况（免费用户显示）
    usage: {
      chat: 3,      // 已用对话次数
      chatLimit: 5, // 对话上限
      review: 1,    // 已用复习次数
      reviewLimit: 3,// 复习上限
      task: 1,      // 已用任务数
      taskLimit: 1  // 任务上限
    },
    // 近7天使用统计（用于智能推荐）
    weeklyStats: {
      chatUsed: 32,    // 使用了32次对话
      chatLimit: 35,   // 免费额度35次/周（5次/天 * 7天）
      reviewUsed: 18,
      reviewLimit: 21
    }
  }

  const currentConfig = MEMBERSHIP_CONFIG[currentLevel]

  // ==================== 事件处理 ====================

  const handleBack = () => {
    if (confirm("确定要返回主界面吗？")) {
      router.push("/")
    }
  }

  const handleUpgrade = (targetLevel: MembershipLevel) => {
    if (targetLevel === currentLevel) return
    alert(`🚀 支付功能开发中\n\n你选择了升级到 ${MEMBERSHIP_CONFIG[targetLevel].name}\n${billingCycle === "yearly" ? "年付" : "月付"}方案\n\n实际产品中这里会调起支付页面。`)
  }

  const handleRenew = () => {
    alert(`🔄 续费功能开发中\n\n续费 ${currentConfig.name}\n有效期将延长${billingCycle === "yearly" ? "1年" : "1个月"}\n\n实际产品中这里会调起支付页面。`)
  }

  // ==================== 渲染辅助函数 ====================

  const renderFeatureValue = (value: boolean | string, isCurrentLevel: boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className={cn("h-5 w-5 mx-auto", isCurrentLevel ? "text-primary" : "text-green-500")} />
      ) : (
        <X className="h-5 w-5 mx-auto text-gray-300" />
      )
    }
    return <span className={cn("text-sm font-medium", isCurrentLevel ? "text-primary" : "text-foreground")}>{value}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#eef2f6]">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          
          <h1 className="text-lg font-semibold text-foreground">会员中心</h1>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={cn(
                currentConfig.bgColor,
                currentConfig.color,
                "border-0"
              )}
            >
              {currentConfig.icon}
              {currentConfig.name}
            </Badge>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* 测试状态切换按钮（演示用） */}
      <div className="container mx-auto px-4 pt-4">
        <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          <span className="font-medium">🎮 演示模式：</span>
          <span className="text-amber-600">点击切换会员状态查看不同界面</span>
          <div className="ml-2 flex gap-2">
            <Button 
              size="sm" 
              variant={currentLevel === "free" ? "default" : "outline"}
              onClick={() => setCurrentLevel("free")}
              className="h-7 text-xs"
            >
              <Lock className="mr-1 h-3 w-3" />
              免费
            </Button>
            <Button 
              size="sm" 
              variant={currentLevel === "pro" ? "default" : "outline"}
              onClick={() => setCurrentLevel("pro")}
              className="h-7 text-xs"
            >
              <Star className="mr-1 h-3 w-3" />
              Pro
            </Button>
            <Button 
              size="sm" 
              variant={currentLevel === "ultra" ? "default" : "outline"}
              onClick={() => setCurrentLevel("ultra")}
              className="h-7 text-xs"
            >
              <Crown className="mr-1 h-3 w-3" />
              Ultra
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
        
        {/* 当前会员状态卡片 */}
        <Card className={cn(
          "border-2 overflow-hidden",
          currentLevel === "free" && "border-gray-200 bg-gray-50/50",
          currentLevel === "pro" && "border-blue-200 bg-blue-50/30",
          currentLevel === "ultra" && "border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30"
        )}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* 左侧：状态信息 */}
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl",
                  currentConfig.bgColor
                )}>
                  {currentLevel === "free" && <Lock className={cn("h-8 w-8", currentConfig.color)} />}
                  {currentLevel === "pro" && <Star className={cn("h-8 w-8", currentConfig.color)} />}
                  {currentLevel === "ultra" && <Crown className={cn("h-8 w-8", currentConfig.color)} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">
                      {currentConfig.icon} {currentConfig.name}
                    </h2>
                    {currentLevel === "pro" && (
                      <Badge className="bg-blue-500 text-white">🔥 性价比之选</Badge>
                    )}
                    {currentLevel === "ultra" && (
                      <Badge className="bg-amber-500 text-white">👑 全能体验</Badge>
                    )}
                  </div>
                  
                  {currentLevel === "free" ? (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-muted-foreground">今日使用情况：</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                          <MessageCircle className="h-3 w-3" />
                          对话 {userData.usage.chat}/{userData.usage.chatLimit}次
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                          <BookOpen className="h-3 w-3" />
                          复习 {userData.usage.review}/{userData.usage.reviewLimit}次
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                          <FileText className="h-3 w-3" />
                          任务 {userData.usage.task}/{userData.usage.taskLimit}个
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        有效期至 <span className="font-medium text-foreground">{userData.expiryDate}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {currentLevel === "pro" ? "核心功能无限制 · 支持自定义链接 · 笔记导出" : "全部功能无限制 · 优先AI响应 · 专属客服 · 年度报告"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 右侧：操作按钮 */}
              <div className="flex flex-wrap gap-2">
                {currentLevel === "free" && (
                  <Button onClick={() => handleUpgrade("pro")} className="gap-2">
                    <Zap className="h-4 w-4" />
                    升级Pro会员
                  </Button>
                )}
                {currentLevel === "pro" && (
                  <>
                    <Button variant="outline" onClick={handleRenew} className="gap-2">
                      <Clock className="h-4 w-4" />
                      续费Pro
                    </Button>
                    <Button onClick={() => handleUpgrade("ultra")} className="gap-2 bg-amber-500 hover:bg-amber-600">
                      <Crown className="h-4 w-4" />
                      升级Ultra
                    </Button>
                  </>
                )}
                {currentLevel === "ultra" && (
                  <Button variant="outline" onClick={handleRenew} className="gap-2 border-amber-300 hover:bg-amber-50">
                    <Clock className="h-4 w-4" />
                    续费Ultra
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 智能推荐卡片 */}
        {currentLevel === "free" && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">📊 智能推荐</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  你最近7天使用了 <span className="font-medium text-amber-700">{userData.weeklyStats.chatUsed}次</span> AI对话，
                  已接近免费额度上限（{userData.weeklyStats.chatLimit}次/周）。
                  升级Pro会员，对话次数提升至 <span className="font-medium text-amber-700">50次/日</span>！
                </p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">本周使用进度</span>
                    <span className="text-amber-700">{Math.round((userData.weeklyStats.chatUsed / userData.weeklyStats.chatLimit) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(userData.weeklyStats.chatUsed / userData.weeklyStats.chatLimit) * 100} 
                    className="h-2 bg-amber-200"
                  />
                </div>
              </div>
              <Button size="sm" onClick={() => handleUpgrade("pro")} className="shrink-0 bg-amber-500 hover:bg-amber-600">
                立即升级
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 套餐选择卡片区 */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">选择套餐</h2>
            <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as "monthly" | "yearly")}>
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="monthly">月付</TabsTrigger>
                <TabsTrigger value="yearly">
                  年付
                  <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 text-[10px]">省更多</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* 免费套餐 */}
            <Card className={cn(
              "relative overflow-hidden",
              currentLevel === "free" && "border-2 border-gray-300"
            )}>
              <CardContent className="p-5">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-500" />
                    <h3 className="font-semibold text-foreground">免费</h3>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">¥0</span>
                    <span className="text-sm text-muted-foreground">/永久</span>
                  </div>
                </div>
                <ul className="mb-5 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    1个学习任务
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    5次/日AI对话
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    基础笔记功能
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    系统推荐视频
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  disabled={currentLevel === "free"}
                  variant={currentLevel === "free" ? "secondary" : "default"}
                >
                  {currentLevel === "free" ? "当前方案" : "选择免费"}
                </Button>
              </CardContent>
            </Card>

            {/* Pro套餐 */}
            <Card className={cn(
              "relative overflow-hidden border-2",
              currentLevel === "pro" ? "border-blue-300" : "border-blue-200"
            )}>
              {/* 推荐标签 */}
              <div className="absolute -right-8 top-4 rotate-45 bg-blue-500 px-10 py-1 text-xs font-medium text-white">
                🔥 推荐
              </div>
              <CardContent className="p-5">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-foreground">Pro会员</h3>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-blue-600">
                      ¥{billingCycle === "monthly" ? MEMBERSHIP_CONFIG.pro.price.monthly : MEMBERSHIP_CONFIG.pro.price.yearly}
                    </span>
                    <span className="text-sm text-muted-foreground">/{billingCycle === "monthly" ? "月" : "年"}</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="mt-1 text-xs text-green-600">
                      相比月付省¥{MEMBERSHIP_CONFIG.pro.price.yearlySave}
                    </p>
                  )}
                </div>
                <ul className="mb-5 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    5个并行任务
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    50次/日AI对话
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    PDF/Markdown导出
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    自定义视频链接
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    1年对话历史保留
                  </li>
                </ul>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={currentLevel === "pro"}
                  onClick={() => currentLevel !== "pro" && handleUpgrade("pro")}
                >
                  {currentLevel === "pro" ? "当前方案" : currentLevel === "ultra" ? "已更高级" : "升级Pro"}
                </Button>
              </CardContent>
            </Card>

            {/* Ultra套餐 */}
            <Card className={cn(
              "relative overflow-hidden",
              currentLevel === "ultra" ? "border-2 border-amber-300" : "border-amber-200",
              "bg-gradient-to-br from-amber-50/30 to-orange-50/20"
            )}>
              <CardContent className="p-5">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold text-foreground">Ultra会员</h3>
                    <Badge className="bg-amber-500 text-white text-[10px]">👑</Badge>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-amber-600">
                      ¥{billingCycle === "monthly" ? MEMBERSHIP_CONFIG.ultra.price.monthly : MEMBERSHIP_CONFIG.ultra.price.yearly}
                    </span>
                    <span className="text-sm text-muted-foreground">/{billingCycle === "monthly" ? "月" : "年"}</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="mt-1 text-xs text-green-600">
                      相比月付省¥{MEMBERSHIP_CONFIG.ultra.price.yearlySave}
                    </p>
                  )}
                </div>
                <ul className="mb-5 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-foreground">全部功能无限制</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-500" />
                    优先AI响应队列
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-500" />
                    专属客服（微信/企微）
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-500" />
                    年度学习报告
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-500" />
                    永久对话历史保留
                  </li>
                </ul>
                <Button 
                  className="w-full bg-amber-500 hover:bg-amber-600"
                  disabled={currentLevel === "ultra"}
                  onClick={() => currentLevel !== "ultra" && handleUpgrade("ultra")}
                >
                  {currentLevel === "ultra" ? "当前方案" : "升级Ultra"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 权益对比表格 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-primary" />
              权益对比
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">功能</th>
                    <th className={cn(
                      "px-4 py-3 text-center text-sm font-medium",
                      currentLevel === "free" && "bg-gray-100 text-gray-700"
                    )}>
                      <span className="flex items-center justify-center gap-1">
                        <Lock className="h-3 w-3" /> 免费
                      </span>
                    </th>
                    <th className={cn(
                      "px-4 py-3 text-center text-sm font-medium",
                      currentLevel === "pro" && "bg-blue-100 text-blue-700"
                    )}>
                      <span className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3" /> Pro
                      </span>
                    </th>
                    <th className={cn(
                      "px-4 py-3 text-center text-sm font-medium",
                      currentLevel === "ultra" && "bg-amber-100 text-amber-700"
                    )}>
                      <span className="flex items-center justify-center gap-1">
                        <Crown className="h-3 w-3" /> Ultra
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES_DATA.map((category, catIdx) => (
                    <>
                      <tr key={catIdx} className="bg-muted/30">
                        <td colSpan={4} className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIdx) => (
                        <tr key={itemIdx} className="border-b last:border-b-0">
                          <td className={cn(
                            "px-4 py-3 text-sm",
                            item.highlight && "font-medium text-foreground"
                          )}>
                            {item.name}
                          </td>
                          <td className={cn(
                            "px-4 py-3 text-center",
                            currentLevel === "free" && "bg-gray-50/50"
                          )}>
                            {renderFeatureValue(item.free, currentLevel === "free")}
                          </td>
                          <td className={cn(
                            "px-4 py-3 text-center",
                            currentLevel === "pro" && "bg-blue-50/30"
                          )}>
                            {renderFeatureValue(item.pro, currentLevel === "pro")}
                          </td>
                          <td className={cn(
                            "px-4 py-3 text-center",
                            currentLevel === "ultra" && "bg-amber-50/30"
                          )}>
                            {renderFeatureValue(item.ultra, currentLevel === "ultra")}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ折叠区 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-5 w-5 text-primary" />
              常见问题
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQ_DATA.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* 底部信任标识 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white/50 p-4 text-sm text-muted-foreground">
            <Shield className="h-5 w-5 text-green-500" />
            <span>随时取消，无需手续费</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white/50 p-4 text-sm text-muted-foreground">
            <Lock className="h-5 w-5 text-blue-500" />
            <span>安全支付，信息加密</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white/50 p-4 text-sm text-muted-foreground">
            <CreditCard className="h-5 w-5 text-purple-500" />
            <span>支持微信 / 支付宝 / 信用卡</span>
          </div>
        </div>

        {/* 底部留白 */}
        <div className="h-8" />
      </main>
    </div>
  )
}
