'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ResultDisplayProps {
  originalText: string
  gloss: string
  imageUrl: string
  onFeedback: (feedback: 'like' | 'dislike' | 'report') => void
}

export default function ResultDisplay({ 
  originalText, 
  gloss, 
  imageUrl, 
  onFeedback 
}: ResultDisplayProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null)

  const handleFeedback = (feedback: 'like' | 'dislike' | 'report') => {
    onFeedback(feedback)
    setFeedbackGiven(feedback)
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          原始文字
        </h2>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
          {originalText}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          TSL Gloss
        </h2>
        <p className="text-gray-700 bg-blue-50 p-4 rounded-lg font-mono text-sm">
          {gloss}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          手語圖片
        </h2>
        <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl}
            alt="Sign language illustration"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          您的回饋
        </h3>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleFeedback('like')}
            disabled={feedbackGiven !== null}
            className="flex items-center gap-2 px-6 py-3 bg-green-100 hover:bg-green-200 disabled:bg-gray-100 text-green-800 disabled:text-gray-500 rounded-lg transition duration-200 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">👍</span>
            <span>很好</span>
          </button>

          <button
            onClick={() => handleFeedback('dislike')}
            disabled={feedbackGiven !== null}
            className="flex items-center gap-2 px-6 py-3 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-800 disabled:text-gray-500 rounded-lg transition duration-200 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">👎</span>
            <span>不好</span>
          </button>

          <button
            onClick={() => handleFeedback('report')}
            disabled={feedbackGiven !== null}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-100 hover:bg-yellow-200 disabled:bg-gray-100 text-yellow-800 disabled:text-gray-500 rounded-lg transition duration-200 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">⚠️</span>
            <span>回報問題</span>
          </button>
        </div>

        {feedbackGiven && (
          <p className="text-center mt-4 text-sm text-gray-600">
            感謝您的回饋！
          </p>
        )}
      </div>
    </div>
  )
}
