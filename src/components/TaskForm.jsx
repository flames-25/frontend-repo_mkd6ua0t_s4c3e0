import { useState } from 'react'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from './api'

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    status: initial?.status || 'todo',
    priority: initial?.priority || 'medium',
    due_date: initial?.due_date || '',
    tags: initial?.tags?.join(', ') || '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      due_date: form.due_date || null,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600 mb-1">标题</label>
        <input name="title" value={form.title} onChange={handleChange} required className="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">描述</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full rounded border px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">状态</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full rounded border px-3 py-2">
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">优先级</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="w-full rounded border px-3 py-2">
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">截止日期</label>
          <input type="date" name="due_date" value={form.due_date?.slice(0,10) || ''} onChange={handleChange} className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">标签（用逗号分隔）</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="w-full rounded border px-3 py-2" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded border">取消</button>
        <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">保存</button>
      </div>
    </form>
  )
}
