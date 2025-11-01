'use client'

import { useState, FormEvent } from 'react'

interface TranslationFormProps {
  onTranslate: (text: string) => void
  isLoading: boolean
}

export default function TranslationForm({ onTranslate, isLoading }: TranslationFormProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onTranslate(text.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label 
          htmlFor="text-input" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          輸入中文文字
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例如：我喜歡學習手語"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
      >
        {isLoading ? '生成中...' : '生成手語圖片'}
      </button>
    </form>
  )
}
