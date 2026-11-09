import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { categorizeMessage } from '../utils/llmHelper'
import { calculateUrgency } from '../utils/urgencyScorer'
import { getRecommendedAction } from '../utils/templates'

function AnalyzePage() {
  const [message, setMessage] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const sampleMessages = [
    'Database connection lost',
    'Thank you so much! Your support team was wonderful!',
    'Could you add an export to CSV feature?'
  ]

  useEffect(() => {
    // Check for example message from home page
    const exampleMessage = localStorage.getItem('exampleMessage')
    if (exampleMessage) {
      setMessage(exampleMessage)
      localStorage.removeItem('exampleMessage')
    }
  }, [])

  const handleAnalyze = async () => {
    if (!message.trim()) {
      alert('Please enter a message to analyze')
      return
    }

    setIsLoading(true)
    setResults(null)
    
    try {
      // Run categorization (LLM call)
      const { category, reasoning } = await categorizeMessage(message)
      
      // Calculate urgency from customer impact before selecting the next action
      const urgency = calculateUrgency(message)
      
      // Route high-impact messages to a human immediately
      const recommendedAction = getRecommendedAction(category, urgency, message)
      
      const analysisResult = {
        message,
        category,
        urgency,
        recommendedAction,
        reasoning,
        timestamp: new Date().toISOString()
      }

      setResults(analysisResult)

      // Save to history
      const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
      history.push(analysisResult)
      localStorage.setItem('triageHistory', JSON.stringify(history))
    } catch (error) {
      console.error('Error analyzing message:', error)
      alert('Error analyzing message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setMessage('')
    setResults(null)
  }

  return (
    <div className="page-shell min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="surface-card mb-6 bg-white p-6 sm:p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-800">
            <span aria-hidden="true">🪄</span> Inbox triage
          </div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-indigo-950">Analyze a customer message</h1>
          <p className="mb-6 text-gray-600">
            Drop in a message and Relay will find its category, urgency, and next step.
          </p>

          {/* Input Section */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste customer message here..."
              className="w-full resize-y rounded-2xl border border-violet-200 bg-violet-50/40 p-4 leading-relaxed text-gray-800 placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              disabled={isLoading}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-extrabold uppercase tracking-wider text-gray-400">Try one</span>
              {sampleMessages.map((sample, index) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setMessage(sample)}
                  disabled={isLoading}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold disabled:opacity-50 ${
                    index === 0 ? 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100' :
                    index === 1 ? 'border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100' :
                    'border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100'
                  }`}
                >
                  {index === 0 ? '🚨 ' : index === 1 ? '💛 ' : '💡 '}{index === 0 ? 'Outage' : index === 1 ? 'Thank-you note' : 'Feature idea'}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {message.length} characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className={`flex-1 rounded-xl py-3 font-extrabold shadow-sm ${
                isLoading
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                  : 'bg-indigo-950 text-white hover:-translate-y-0.5 hover:bg-indigo-900'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Message'
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="rounded-xl border border-gray-200 px-6 py-3 font-bold text-gray-600 hover:border-violet-200 hover:bg-violet-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="surface-card bg-white p-6 sm:p-8">
            <h2 className="mb-5 text-xl font-extrabold text-indigo-950">Relay’s read <span aria-hidden="true">✨</span></h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Category</div>
                <div className="inline-block rounded-xl bg-violet-100 px-4 py-2 font-extrabold text-violet-900">
                  {results.category}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Urgency Level</div>
                <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                  results.urgency === 'High' ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-200' :
                  results.urgency === 'Medium' ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-200' :
                  'bg-sky-100 text-sky-900 ring-1 ring-sky-200'
                }`}>
                  {results.urgency === 'High' ? '🚨 ' : results.urgency === 'Medium' ? '⏳ ' : '🌤️ '}{results.urgency}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Recommended Action</div>
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <p className="leading-relaxed text-gray-800">{results.recommendedAction}</p>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">AI Reasoning</div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>
                      {results.reasoning}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const text = `Category: ${results.category}\nUrgency: ${results.urgency}\nRecommendation: ${results.recommendedAction}\n\nReasoning: ${results.reasoning}`
                  navigator.clipboard.writeText(text)
                  alert('Results copied to clipboard!')
                }}
                className="rounded-xl bg-indigo-50 px-4 py-2 font-bold text-indigo-800 hover:bg-indigo-100"
              >
                📋 Copy Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyzePage
