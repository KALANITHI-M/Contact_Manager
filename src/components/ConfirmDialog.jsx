import React from 'react'

export default function ConfirmDialog({ open, title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="absolute inset-x-4 top-1/3 max-w-md mx-auto bg-white rounded-2xl p-4 border border-gray-200 shadow-card">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        <div className="flex gap-3 mt-4">
          <button onClick={onCancel} className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 active:scale-[0.98]">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="flex-1 h-11 rounded-xl bg-rose-600 text-white active:scale-[0.98]">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
