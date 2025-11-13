const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export async function fetchJSON(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const TasksAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, v)
    })
    const qstr = qs.toString() ? `?${qs.toString()}` : ''
    return fetchJSON(`/api/tasks${qstr}`)
  },
  create: (data) => fetchJSON(`/api/tasks`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchJSON(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id) => fetchJSON(`/api/tasks/${id}`, { method: 'DELETE' }),
}

export const STATUS_OPTIONS = [
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'done', label: '已完成' },
]
export const PRIORITY_OPTIONS = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
]
