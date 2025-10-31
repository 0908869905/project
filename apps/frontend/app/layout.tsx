import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '手語圖片生成器 - Sign Language AI',
  description: '使用 AI 將文字轉換為手語圖片',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}

