import React, { useState, useMemo } from 'react'
import DialPad from './DialPad.jsx'
import KeypadFAB from './KeypadFAB.jsx'
import ContactDetails from './ContactDetails.jsx'

function formatClock(ts) {
  try {
    const d = new Date(ts)
    let h = d.getHours()
    const m = String(d.getMinutes()).padStart(2, '0')
    const ampm = h < 12 ? 'am' : 'pm'
    h = h % 12 || 12
    return `${h}:${m} ${ampm}`
  } catch {
    return ''
  }
}

function ArrowIcon({ type }) {
  const size = 22
  if (type === 'missed') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-rose-500">
        <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
  if (type === 'incoming') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-gray-400">
        <path d="M18 6v8H10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M18 14L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="text-emerald-500">
      <path d="M6 18V10h8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M6 10l12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function useContactMap(contacts = []) {
  return useMemo(() => {
    const m = new Map()
    for (const c of contacts) m.set(c.id, c)
    return m
  }, [contacts])
}

export default function CallHistory({ callHistory, contacts = [], onDial, onOpenDetails, onToggleFavorite }) {
  const [padOpen, setPadOpen] = useState(false)
  const idToContact = useContactMap(contacts)
  const [detailsFor, setDetailsFor] = useState(null)

  return (
    <section className={`pb-${padOpen ? '72' : '28'}`}>
      {!detailsFor && (
        <>
          <header className="px-4 pt-6">
            <h1 className="text-xl font-semibold">All calls</h1>
          </header>

          <ul className="mt-3 max-w-md mx-auto">
            {callHistory.map((h, idx) => {
              const contact = h.contactId ? idToContact.get(h.contactId) : null
              const isMissed = h.type === 'missed'
              const name = contact?.name || h.name || h.phone
              const avatar = contact?.avatar
              const number = h.phone || contact?.phones?.[0] || ''
              const nameClass = isMissed ? 'text-rose-500' : 'text-white'

              return (
                <li key={h.id} className={`px-4 py-4 ${idx !== callHistory.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <div className="flex items-center gap-3">
                    <ArrowIcon type={h.type} />
                    <div className="h-9 w-9 rounded-full overflow-hidden bg-neutral-700/60 grid place-items-center text-gray-300">
                      {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
                          <path d="M6.5 19c1-3.2 3.6-4.8 5.5-4.8s4.5 1.6 5.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => onDial(contact || { name }, number)} role="button">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className={`truncate text-[18px] ${nameClass}`}>{name}</div>
                          {number && <div className="text-sm text-gray-400 truncate">{number}</div>}
                        </div>
                        <div className="shrink-0 text-gray-400 text-[15px]">{formatClock(h.timestamp)}</div>
                      </div>
                    </div>
                    <button
                      className="shrink-0 h-9 w-9 rounded-full bg-[#1f1f1f] border border-white/10 grid place-items-center text-gray-300"
                      aria-label="Details"
                      onClick={() => setDetailsFor({ contact, fallbackName: h.name, fallbackPhone: number })}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </li>
              )
            })}

            {callHistory.length === 0 && (
              <div className="text-center text-gray-500 py-10">No calls yet.</div>
            )}
          </ul>

          {padOpen && <DialPad onDial={onDial} />}
          <KeypadFAB onClick={() => setPadOpen(v => !v)} />
        </>
      )}

      {detailsFor && (
        <ContactDetails
          contact={detailsFor.contact || undefined}
          fallbackName={detailsFor.fallbackName}
          fallbackPhone={detailsFor.fallbackPhone}
          onBack={() => setDetailsFor(null)}
          onEdit={(c) => onOpenDetails ? onOpenDetails(c) : null}
          onDial={onDial}
          onAdd={(prefill) => onOpenDetails ? onOpenDetails(prefill) : null}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </section>
  )
}
