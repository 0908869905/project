'use client'

import { useState } from 'react'

interface GeneratedImage {
  id: string
  url: string
  gloss: string
  timestamp: number
}

interface FeedbackData {
  imageId: string
  type: 'thumbsUp' | 'thumbsDown' | 'warning'
}

export default function SignLanguageGenerator() {
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [gloss, setGloss] = useState<string>('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('請輸入文字')
      return
    }

    setIsLoading(true)
    setError(null)
    setGeneratedImages([])
    setGloss('')

    try {
      // Step 1: Translate to TSL gloss
      const translateResponse = await fetch(`${API_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!translateResponse.ok) {
        throw new Error('翻譯失敗')
      }

      const translateData = await translateResponse.json()
      setGloss(translateData.gloss)

      // Step 2: Generate images
      const generateResponse = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText,
          gloss: translateData.gloss 
        }),
      })

      if (!generateResponse.ok) {
        throw new Error('生成圖片失敗')
      }

      const generateData = await generateResponse.json()
      
      // Step 3: Postprocess if needed
      const postprocessResponse = await fetch(`${API_URL}/api/postprocess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          images: generateData.images,
          gloss: translateData.gloss
        }),
      })

      if (!postprocessResponse.ok) {
        throw new Error('後處理失敗')
      }

      const postprocessData = await postprocessResponse.json()
      setGeneratedImages(postprocessData.images)

    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (imageId: string, type: FeedbackData['type']) => {
    try {
      await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId, type }),
      })
      alert('感謝您的回饋！')
    } catch (err) {
      console.error('提交回饋失敗:', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
      {/* Input Section */}
      <div className="mb-6">
        <label htmlFor="textInput" className="block text-lg font-semibold text-gray-700 mb-2">
          輸入文字：
        </label>
        <textarea
          id="textInput"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="請輸入想要轉換成手語的中文..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none text-gray-900"
          disabled={isLoading}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            生成中...
          </span>
        ) : (
          '生成手語圖片'
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* TSL Gloss Display */}
      {gloss && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">TSL Gloss:</h3>
          <p className="text-blue-800">{gloss}</p>
        </div>
      )}

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">生成的手語圖片：</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedImages.map((image) => (
              <div key={image.id} className="border-2 border-purple-200 rounded-lg p-4 bg-gray-50">
                <img
                  src={image.url}
                  alt={image.gloss}
                  className="w-full h-64 object-contain rounded-lg mb-3 bg-white"
                />
                <p className="text-sm text-gray-600 mb-3 text-center">{image.gloss}</p>
                
                {/* Feedback Buttons */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleFeedback(image.id, 'thumbsUp')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    title="正確"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleFeedback(image.id, 'thumbsDown')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    title="不正確"
                  >
                    👎
                  </button>
                  <button
                    onClick={() => handleFeedback(image.id, 'warning')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                    title="需要改進"
                  >
                    ⚠️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder when no images */}
      {!isLoading && generatedImages.length === 0 && !error && (
        <div className="mt-8 p-12 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500 text-lg">在上方輸入文字後點擊按鈕生成手語圖片</p>
        </div>
      )}
    </div>
  )
}
