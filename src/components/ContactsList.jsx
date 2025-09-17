import React, { useMemo, useRef } from 'react'
import AlphaIndexBar from './AlphaIndexBar.jsx'
import { formatPhone } from '../utils/format.js'

function CallButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center active:scale-95"
      aria-label="Call"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 3l3 3-2 2c1.5 3 4 5.5 7 7l2-2 3 3-2 3c-6-.5-12.5-7-13-13L6 3z" fill="currentColor"/>
      </svg>
    </button>
  )
}

export default function ContactsList({ contacts, totalCount, query, onQueryChange, onEdit, onDelete, onDial }) {
  const sections = useMemo(() => {
    const groups = new Map()
    // Add favorites section first
    const favorites = contacts.filter(c => c.favorite)
    if (favorites.length > 0) {
      groups.set('★', favorites)
    }
    
    // Group remaining contacts by first letter
    const nonFavorites = contacts.filter(c => !c.favorite)
    for (const c of nonFavorites) {
      const letter = (c.name?.[0] || '#').toUpperCase()
      const key = /[A-Z]/.test(letter) ? letter : '#'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(c)
    }
    return Array.from(groups.entries()).sort(([a],[b]) => {
      if (a === '★') return -1
      if (b === '★') return 1
      return a.localeCompare(b)
    })
  }, [contacts])

  const anchorsRef = useRef({})
  function handleJump(letter) {
    const el = anchorsRef.current[letter]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const phoneInQuery = useMemo(() => {
    const digits = (query || '').replace(/[^0-9+]/g, '')
    return digits.length >= 3 ? digits : ''
  }, [query])

  return (
    <section className="relative h-full flex flex-col">
      {/* Header moved to App.jsx - keep spacer for layout consistency if needed */}
      <div className="hidden"></div>

      {/* Scrollable Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {/* Add right padding so items do not overlap AlphaIndexBar (≈ 20–30px) */}
        <div className="px-2 pr-8 sm:pr-10 md:pr-12 lg:pr-16 space-y-2 max-w-md mx-auto pb-32">
          {sections.map(([letter, list]) => (
            <div key={letter}>
              <div
                ref={(el) => (anchorsRef.current[letter] = el)}
                className="px-2 py-1 text-xs text-gray-400 font-medium"
              >
                {letter}
              </div>
              <ul className="space-y-1">
                {list.map((c) => (
                  <li key={c.id} className="bg-[#121212] rounded-2xl border border-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 h-12 w-12 rounded-full overflow-hidden bg-neutral-700/60 grid place-items-center text-sm">
                        {c.avatar ? (
                          <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-300">👤</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">{c.name}</h3>
                            {c.favorite && (
                              <svg width="16" height="16" viewBox="0 0 24 24" className="text-rose-400 shrink-0" fill="currentColor">
                                <path d="M12 4.5l2.8 5.6 6.2.9-4.5 4.4 1 6.2L12 18.8 6.5 21.6l1-6.2L3 11l6.2-.9L12 4.5z"/>
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onEdit(c)}
                              className="text-gray-400 hover:text-white p-2 rounded-lg"
                              aria-label="Edit"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z" stroke="currentColor" strokeWidth="1.6" />
                              </svg>
                            </button>
                            <button
                              onClick={() => onDelete(c)}
                              className="text-gray-400 hover:text-rose-400 p-2 rounded-lg"
                              aria-label="Delete"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M6 7h12M9 7V5h6v2M7 7l1 12h8l1-12" stroke="currentColor" strokeWidth="1.6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-col gap-0.5">
                          <p className="text-sm text-gray-400 leading-none">{c.email || 'No email'}</p>
                          {(c.phones || []).slice(0, 1).map((p, i) => (
                            <p key={i} className="text-[13px] text-gray-300 leading-none">{formatPhone(p)}</p>
                          ))}
                        </div>
                      </div>
                      <CallButton onClick={() => onDial(c, (c.phones || [])[0])} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No contacts found.
            </div>
          )}
        </div>
      </div>

      <AlphaIndexBar onJump={handleJump} />
    </section>
  )
}
