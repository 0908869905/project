'use client'

import { useState } from 'react'
import TranslationForm from '@/components/TranslationForm'
import ResultDisplay from '@/components/ResultDisplay'

export default function Home() {
  const [result, setResult] = useState<{
    originalText: string
    gloss: string
    imageUrl: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTranslate = async (text: string) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/translate-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult({
        originalText: data.originalText,
        gloss: data.gloss,
        imageUrl: data.imageUrl,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Translation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (feedback: 'like' | 'dislike' | 'report') => {
    if (!result) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      await fetch(`${apiUrl}/api/postprocess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: result.imageUrl,
          feedback,
        }),
      })
    } catch (err) {
      console.error('Feedback error:', err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            文字轉手語網站
          </h1>
          <p className="text-xl text-gray-600">
            Text to Taiwan Sign Language (TSL)
          </p>
          <p className="mt-2 text-sm text-gray-500">
            輸入中文，AI 生成手語圖片
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <TranslationForm 
            onTranslate={handleTranslate} 
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                錯誤：{error}
              </p>
            </div>
          )}
        </div>

        {result && (
          <ResultDisplay
            originalText={result.originalText}
            gloss={result.gloss}
            imageUrl={result.imageUrl}
            onFeedback={handleFeedback}
          />
        )}

        {isLoading && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在生成手語圖片...</p>
          </div>
        )}
      </div>
    </main>
  )
}
