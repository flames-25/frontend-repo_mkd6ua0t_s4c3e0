import Views from './components/Views'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header className="sticky top-0 backdrop-blur bg-white/60 border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">任务管理 · 小而美</h1>
          <nav className="text-sm text-gray-600 space-x-4">
            <a href="/" className="hover:text-gray-900">主页</a>
            <a href="/test" className="hover:text-gray-900">后端状态</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Views />
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">专注核心：看板 · 列表 · 日历 | 任务 CRUD | 搜索筛选 | Mock 数据</footer>
    </div>
  )
}

export default App
