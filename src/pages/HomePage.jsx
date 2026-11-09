import { Link } from 'react-router-dom'

function HomePage() {
  const history = JSON.parse(localStorage.getItem('triageHistory') || '[]')
  const today = new Date().toDateString()
  const stats = {
    total: history.length,
    today: history.filter(item => new Date(item.timestamp).toDateString() === today).length
  }
  const recentActivity = history.slice(-3).reverse()

  return (
    <div className="page-shell min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="surface-card relative mb-7 overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-800 p-7 text-white sm:p-10">
          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute right-16 top-12 h-40 w-40 rounded-full border border-white/10" />
          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200/30 bg-orange-300/10 px-3 py-1.5 text-sm font-bold text-orange-200">
              <span aria-hidden="true">✦</span> Your support sidekick
            </div>
            <h1 className="mb-4 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Every message finds its <span className="text-orange-300">next step.</span>
            </h1>
            <p className="mb-7 max-w-2xl text-lg leading-relaxed text-indigo-100">
              Relay sorts the inbox, spots the fires, and gives your team a clear place to start.
            </p>
            <Link to="/analyze" className="inline-flex items-center gap-2 rounded-xl bg-orange-300 px-5 py-3 font-extrabold text-indigo-950 shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-orange-200">
              Triage a message <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="hero-orbit absolute right-12 top-1/2 hidden -translate-y-1/2 rounded-[2rem] border border-white/20 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-sm lg:block">
            <div className="text-6xl" aria-hidden="true">💌</div>
            <div className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-200">Inbox, meet calm</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="surface-card flex items-center gap-4 bg-white p-5 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl" aria-hidden="true">✉️</div>
            <div>
              <div className="text-3xl font-black tracking-tight text-indigo-950">{stats.total}</div>
              <div className="text-sm font-semibold text-gray-500">Messages triaged</div>
            </div>
          </div>
          <div className="surface-card flex items-center gap-4 bg-white p-5 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl" aria-hidden="true">⚡</div>
            <div>
              <div className="text-3xl font-black tracking-tight text-indigo-950">{stats.today}</div>
              <div className="text-sm font-semibold text-gray-500">Handled today</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/analyze"
            className="action-card surface-card bg-gradient-to-br from-sky-500 to-blue-700 p-6 text-white"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">🪄</div>
            <div className="mb-1 text-lg font-extrabold">Analyze a message</div>
            <div className="text-sm text-blue-100">Get category, urgency, and a next step</div>
          </Link>

          <Link
            to="/history"
            className="action-card surface-card bg-gradient-to-br from-fuchsia-500 to-violet-700 p-6 text-white"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">🗂️</div>
            <div className="mb-1 text-lg font-extrabold">Visit your history</div>
            <div className="text-sm text-purple-100">See what your team has triaged</div>
          </Link>

          <button
            onClick={() => {
              const examples = [
                "Our payment failed and we can't access our account",
                "The dashboard is loading very slowly",
                "Can you add a dark mode feature?"
              ]
              const random = examples[Math.floor(Math.random() * examples.length)]
              localStorage.setItem('exampleMessage', random)
              window.location.href = '/analyze'
            }}
            className="action-card surface-card bg-gradient-to-br from-orange-400 to-rose-500 p-6 text-left text-white"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">🎲</div>
            <div className="mb-1 text-lg font-extrabold">Surprise me</div>
            <div className="text-sm text-orange-50">Practice with a sample message</div>
          </button>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="surface-card bg-white p-6">
            <h2 className="mb-4 text-xl font-extrabold text-indigo-950">Recent activity <span aria-hidden="true">✨</span></h2>
            <div className="space-y-3">
              {recentActivity.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <div className="text-gray-700 truncate">
                        "{item.message.substring(0, 60)}..."
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {item.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.urgency === 'High' ? 'bg-red-100 text-red-800' :
                          item.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.urgency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentActivity.length === 0 && (
          <div className="surface-card bg-white p-8 text-center">
            <div className="mb-3 text-5xl">🛝</div>
            <div className="mb-2 text-xl font-extrabold text-indigo-950">Your inbox adventure starts here</div>
            <div className="mb-5 text-gray-500">Run a first message through Relay and see what happens.</div>
            <Link
              to="/analyze"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Analyze Your First Message
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
