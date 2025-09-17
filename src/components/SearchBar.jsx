import React from 'react'

export default function SearchBar({ value, onChange, placeholder = 'Search contacts' }) {
  return (
    <div className="px-4 pt-4">
      <label className="w-full flex items-center gap-2 bg-white rounded-2xl border border-gray-200 px-3 py-2 shadow-card">
        <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-500">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" fill="none"/>
          <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none text-[15px] placeholder:text-gray-400"
        />
        {value && (
          <button onClick={() => onChange('')} className="text-gray-400 px-1" aria-label="Clear">
            ✕
          </button>
        )}
      </label>
    </div>
  )
}
