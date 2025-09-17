import React from 'react'

export default function FAB({ onClick, ariaLabel = 'Action' }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="fixed bottom-20 right-16 xs:right-20 z-10 h-16 w-16 rounded-full bg-emerald-500 text-white shadow-fab flex items-center justify-center active:scale-95"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="transparent"/>
        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
      </svg>
    </button>
  )
}
