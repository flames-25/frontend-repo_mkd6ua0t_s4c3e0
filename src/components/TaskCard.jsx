import { CheckCircle2, Clock, Flag } from 'lucide-react'

export default function TaskCard({ task, onToggleDone, onEdit, onDelete }) {
  const isDone = task.status === 'done'
  const priorityColor = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  }[task.priority || 'medium']

  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm hover:shadow transition ${isDone ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <button
            onClick={() => onToggleDone(task)}
            className={`mt-1 rounded-full border p-1 ${isDone ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50'}`}
            title={isDone ? '标记未完成' : '标记完成'}
          >
            <CheckCircle2 className={`h-5 w-5 ${isDone ? 'text-green-600' : 'text-gray-400'}`} />
          </button>
          <div>
            <h4 className="font-semibold text-gray-800">{task.title}</h4>
            {task.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {task.due_date && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${priorityColor}`}>
                <Flag className="h-3 w-3" />
                {task.priority === 'high' ? '高' : task.priority === 'low' ? '低' : '中'}
              </span>
              {task.tags?.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">#{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="text-sm text-blue-600 hover:underline" onClick={() => onEdit(task)}>编辑</button>
          <button className="text-sm text-red-600 hover:underline" onClick={() => onDelete(task)}>删除</button>
        </div>
      </div>
    </div>
  )
}
