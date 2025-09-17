import React, { useState } from 'react'
import CallForwardingDialog from './CallForwardingDialog.jsx'
import { showIncomingCallAlert } from '../utils/notifications.js'

export default function ContactDetails({
  contact, // optional; if absent, use fallback
  fallbackName = '',
  fallbackPhone = '',
  onBack,
  onEdit, // open edit screen
  onDial,
  onAdd, // create new contact from unknown
  onToggleFavorite, // (id, value)
}) {
  const [isEditingInline, setIsEditingInline] = useState(false)
  const [draftName, setDraftName] = useState(contact?.name || fallbackName || '')
  const [favorite, setFavorite] = useState(!!contact?.favorite)
  const [showForwarding, setShowForwarding] = useState(false)

  const name = contact?.name || fallbackName || fallbackPhone || 'Unknown'
  const email = contact?.email || ''
  const avatar = contact?.avatar || ''
  const phones = contact?.phones?.length ? contact.phones : (fallbackPhone ? [fallbackPhone] : [])

  function toggleFav() {
    const next = !favorite
    setFavorite(next)
    if (contact?.id && onToggleFavorite) onToggleFavorite(contact.id, next)
  }

  function handleEditClick() {
    if (contact && onEdit) onEdit(contact)
    else setIsEditingInline(true)
  }

  function handleSaveInline() {
    if (onAdd) onAdd({ name: draftName || fallbackPhone, email: '', phones: [fallbackPhone].filter(Boolean) })
    setIsEditingInline(false)
  }

  function simulateIncomingCall() {
    const phoneNumber = phones[0] || fallbackPhone
    if (phoneNumber) {
      showIncomingCallAlert(name, phoneNumber)
    }
  }

  return (
    <section>
      <header className="px-4 pt-4 pb-3 sticky top-0 z-10 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={onBack} aria-label="Back" className="h-10 w-10 grid place-items-center text-gray-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Details</h1>
          <div className="flex items-center gap-2">
            <button onClick={toggleFav} className={`h-10 w-10 grid place-items-center rounded-full ${favorite ? 'text-rose-400' : 'text-gray-300'}`} aria-label="Favorite">
              {favorite ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5l2.8 5.6 6.2.9-4.5 4.4 1 6.2L12 18.8 6.5 21.6l1-6.2L3 11l6.2-.9L12 4.5z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4.5l2.8 5.6 6.2.9-4.5 4.4 1 6.2L12 18.8 6.5 21.6l1-6.2L3 11l6.2-.9L12 4.5z" stroke="currentColor" strokeWidth="1.6"/></svg>
              )}
            </button>
            <button onClick={handleEditClick} className="px-3 h-10 rounded-xl bg-emerald-500 text-white">Edit</button>
          </div>
        </div>
      </header>

      <div className="px-4 pt-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-neutral-800 grid place-items-center text-gray-400 border border-white/10">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M6.5 19c1-3.4 3.8-5.1 5.5-5.1 1.7 0 4.5 1.7 5.5 5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <div className="min-w-0">
              {isEditingInline ? (
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="bg-[#151515] border border-white/10 rounded-xl px-3 py-2 text-xl"
                />
              ) : (
                <div className="text-xl font-semibold truncate">{name}</div>
              )}
            </div>
          </div>

          {phones.length > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <div className="text-[18px]">{phones[0]}</div>
              <button
                onClick={() => onDial(contact || { name }, phones[0])}
                className="h-11 w-11 rounded-full bg-emerald-500 text-white grid place-items-center"
                aria-label="Call"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 3l3 3-2 2c1.5 3 4 5.5 7 7l2-2 3 3-2 3c-6-.5-12.5-7-13-13L6 3z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <button
              onClick={() => setShowForwarding(true)}
              className="w-full text-left bg-[#121212] hover:bg-[#171717] border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">Call Forwarding</div>
                <div className="text-sm text-gray-400">Set up call forwarding rules</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              onClick={simulateIncomingCall}
              className="w-full text-left bg-[#121212] hover:bg-[#171717] border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">Simulate Incoming Call</div>
                <div className="text-sm text-gray-400">Test call notification</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                <path d="M6 3l3 3-2 2c1.5 3 4 5.5 7 7l2-2 3 3-2 3c-6-.5-12.5-7-13-13L6 3z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="text-gray-400 text-sm">Call history</div>
            <div className="mt-2 text-gray-400 text-sm">No recent calls</div>
          </div>

          {isEditingInline && (
            <div className="mt-6 flex gap-3">
              <button onClick={() => setIsEditingInline(false)} className="flex-1 h-11 rounded-xl border border-white/15 text-gray-300">Cancel</button>
              <button onClick={handleSaveInline} className="flex-1 h-11 rounded-xl bg-emerald-500 text-white">Save</button>
            </div>
          )}
        </div>
      </div>

      <CallForwardingDialog 
        open={showForwarding} 
        onClose={() => setShowForwarding(false)} 
        contact={contact || { name, phones: [fallbackPhone].filter(Boolean) }}
      />
    </section>
  )
}
