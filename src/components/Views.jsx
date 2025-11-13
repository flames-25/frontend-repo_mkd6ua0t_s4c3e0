import { useEffect, useMemo, useState } from 'react'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import { TasksAPI, STATUS_OPTIONS } from './api'

function Toolbar({ onAdd, filter, setFilter }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <input
          placeholder="搜索标题/描述..."
          value={filter.q || ''}
          onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
          className="rounded border px-3 py-2 w-64"
        />
        <select
          value={filter.status || ''}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value || undefined }))}
          className="rounded border px-3 py-2"
        >
          <option value="">全部状态</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <input
          placeholder="标签"
          value={filter.tag || ''}
          onChange={(e) => setFilter((f) => ({ ...f, tag: e.target.value }))}
          className="rounded border px-3 py-2 w-40"
        />
      </div>
      <button onClick={onAdd} className="rounded bg-blue-600 text-white px-3 py-2">新建任务</button>
    </div>
  )
}

export function KanbanView({ tasks, onToggleDone, onEdit, onDelete }) {
  const columns = useMemo(() => ({
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  }), [tasks])
  const colMeta = {
    todo: { title: '待办' },
    in_progress: { title: '进行中' },
    done: { title: '已完成' },
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(columns).map(([key, list]) => (
        <div key={key} className="bg-gray-50 rounded-lg p-3 border">
          <h3 className="font-semibold text-gray-700 mb-3">{colMeta[key].title} ({list.length})</h3>
          <div className="space-y-3">
            {list.map((t) => (
              <TaskCard key={t.id} task={t} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {list.length === 0 && <p className="text-sm text-gray-400">暂无</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ListView({ tasks, onToggleDone, onEdit, onDelete }) {
  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />
      ))}
      {tasks.length === 0 && <p className="text-sm text-gray-400">没有符合条件的任务</p>}
    </div>
  )
}

export function CalendarView({ tasks, onToggleDone, onEdit, onDelete }) {
  // simple month grouping
  const groups = useMemo(() => {
    const m = new Map()
    tasks.forEach((t) => {
      if (!t.due_date) return
      const d = new Date(t.due_date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!m.has(key)) m.set(key, [])
      m.get(key).push(t)
    })
    return Array.from(m.entries()).sort()
  }, [tasks])

  return (
    <div className="space-y-6">
      {groups.length === 0 && <p className="text-sm text-gray-400">本视图仅展示设置了截止日期的任务</p>}
      {groups.map(([key, list]) => (
        <div key={key}>
          <h3 className="font-semibold text-gray-700 mb-3">{key}</h3>
          <div className="space-y-3">
            {list.map((t) => (
              <TaskCard key={t.id} task={t} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />)
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Views() {
  const [view, setView] = useState('kanban')
  const [filter, setFilter] = useState({ q: '', status: undefined, tag: '' })
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await TasksAPI.list(filter)
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  async function handleCreate(data) {
    const created = await TasksAPI.create(data)
    setShowForm(false)
    setTasks((list) => [created, ...list])
  }

  async function handleUpdate(data) {
    const updated = await TasksAPI.update(editing.id, data)
    setEditing(null)
    setShowForm(false)
    setTasks((list) => list.map((t) => (t.id === updated.id ? updated : t)))
  }

  async function handleToggleDone(task) {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    const updated = await TasksAPI.update(task.id, { status: newStatus })
    setTasks((list) => list.map((t) => (t.id === task.id ? updated : t)))
  }

  async function handleDelete(task) {
    await TasksAPI.remove(task.id)
    setTasks((list) => list.filter((t) => t.id !== task.id))
  }

  return (
    <div className="space-y-4">
      <Toolbar onAdd={() => { setEditing(null); setShowForm(true) }} filter={filter} setFilter={setFilter} />

      <div className="flex items-center gap-2">
        {[
          { id: 'kanban', label: '看板' },
          { id: 'list', label: '列表' },
          { id: 'calendar', label: '日历' },
        ].map((t) => (
          <button
            key={t.id}
            className={`px-3 py-1.5 rounded border ${view === t.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'}`}
            onClick={() => setView(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-gray-400">加载中…</p>}

      {!loading && (
        view === 'kanban' ? (
          <KanbanView tasks={tasks} onToggleDone={handleToggleDone} onEdit={(t) => { setEditing(t); setShowForm(true) }} onDelete={handleDelete} />
        ) : view === 'list' ? (
          <ListView tasks={tasks} onToggleDone={handleToggleDone} onEdit={(t) => { setEditing(t); setShowForm(true) }} onDelete={handleDelete} />
        ) : (
          <CalendarView tasks={tasks} onToggleDone={handleToggleDone} onEdit={(t) => { setEditing(t); setShowForm(true) }} onDelete={handleDelete} />
        )
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{editing ? '编辑任务' : '新建任务'}</h3>
              <button onClick={() => { setEditing(null); setShowForm(false) }} className="text-gray-500">✕</button>
            </div>
            <TaskForm initial={editing} onSubmit={editing ? handleUpdate : handleCreate} onCancel={() => { setEditing(null); setShowForm(false) }} />
          </div>
        </div>
      )}
    </div>
  )
}
