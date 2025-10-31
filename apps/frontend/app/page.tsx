'use client'

import { useState } from 'react'
import SignLanguageGenerator from '@/components/SignLanguageGenerator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🤟 手語圖片生成器
          </h1>
          <p className="text-xl text-white/90">
            使用 AI 將文字轉換為手語圖片
          </p>
        </header>
        
        <SignLanguageGenerator />
        
        <footer className="text-center mt-12 text-white/70">
          <p>© 2025 手語圖片生成器 - 讓溝通更無障礙</p>
          <p className="text-sm mt-2">Powered by OpenAI & Next.js</p>
        </footer>
      </div>
    </main>
  )
}
