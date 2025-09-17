import React from 'react'

export default function KeypadFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open dial pad"
      className="fixed bottom-20 right-6 xs:right-8 z-20 h-16 w-16 rounded-full bg-emerald-500 text-white shadow-fab grid place-items-center active:scale-95"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <g fill="currentColor">
          <circle cx="6" cy="6" r="2"/>
          <circle cx="12" cy="6" r="2"/>
          <circle cx="18" cy="6" r="2"/>
          <circle cx="6" cy="12" r="2"/>
          <circle cx="12" cy="12" r="2"/>
          <circle cx="18" cy="12" r="2"/>
          <circle cx="6" cy="18" r="2"/>
          <circle cx="12" cy="18" r="2"/>
          <circle cx="18" cy="18" r="2"/>
        </g>
      </svg>
    </button>
  )
}
