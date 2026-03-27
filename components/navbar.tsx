"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface NavbarProps {
  isMember?: boolean
}

export function Navbar({ isMember = true }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            LearnPal
          </span>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-3">
          <Badge 
            variant={isMember ? "default" : "secondary"}
            className={isMember 
              ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 hover:from-amber-500 hover:to-yellow-600 border-0" 
              : "bg-muted text-muted-foreground"
            }
          >
            {isMember ? "会员" : "试用"}
          </Badge>
          <Avatar className="h-9 w-9 ring-2 ring-border/50 transition-all hover:ring-primary/50">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=learnpal" alt="用户头像" />
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600">
              LP
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
