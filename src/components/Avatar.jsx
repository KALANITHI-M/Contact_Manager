import React from 'react'

const COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-cyan-100 text-cyan-700',
]

function hashIndex(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i)
  return Math.abs(h) % COLORS.length
}

export default function Avatar({ name = '' }) {
  const initials = name.trim().split(/\s+/).slice(0,2).map(s => s[0]?.toUpperCase() || '').join('') || 'U'
  const color = COLORS[hashIndex(name)]
  return (
    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold ${color}`}>
      {initials}
    </div>
  )
}
