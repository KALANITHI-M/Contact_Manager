import React from 'react'

function IconContacts({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="1.8"/>
      <circle cx="12" cy="10" r="3" stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="1.8"/>
      <path d="M6 18c.8-2.7 3.2-4 6-4s5.2 1.3 6 4" stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function IconAdd({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="1.8"/>
      <path d="M12 8v8M8 12h8" stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function IconHistory({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="1.8"/>
      <path d="M12 7v5l3 2" stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function Navbar({ active, onChange, tabs }) {
  const items = [
    { key: tabs.CONTACTS, label: 'Contacts', icon: IconContacts },
    { key: tabs.ADD, label: 'Add', icon: IconAdd },
    { key: tabs.HISTORY, label: 'History', icon: IconHistory },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-area-bottom bg-[#0b0b0b] border-t border-white/10">
      <div className="mx-auto max-w-md">
        <div className="grid grid-cols-3">
          {items.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className={`flex flex-col items-center justify-center py-3 gap-1 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}
                aria-label={label}
              >
                <Icon active={isActive} />
                <span className="text-[11px]">{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
