import React, { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import FAB from './components/FAB.jsx'
import ContactsList from './components/ContactsList.jsx'
import AddContact from './components/AddContact.jsx'
import EditContact from './components/EditContact.jsx'
import CallHistory from './components/CallHistory.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import DialerDialog from './components/DialerDialog.jsx'
import Auth from './components/Auth.jsx'
import {
  loadContacts,
  createContact,
  updateContact as apiUpdateContact,
  deleteContact as apiDeleteContact,
  toggleFavorite as apiToggleFavorite,
  loadCallHistory,
  logCallApi,
  seedIfEmpty,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
} from './utils/storage.js'
import { requestNotificationPermission } from './utils/notifications.js'
import { generateId } from './utils/id.js'
import { randomCallDurationSeconds, formatPhone } from './utils/format.js'
import { getCurrentUser, setCurrentUser, clearCurrentUser } from './utils/storage.js'

const TABS = {
  CONTACTS: 'contacts',
  ADD: 'add',
  HISTORY: 'history',
  EDIT: 'edit',
}

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.CONTACTS)
  const [contacts, setContacts] = useState([])
  const [callHistory, setCallHistory] = useState([])
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [editingContact, setEditingContact] = useState(null)
  const [pendingDial, setPendingDial] = useState(null)
  const [isAuthed, setIsAuthed] = useState(!!getAuthToken())
  const [currentUser, setCurrentUserState] = useState(getCurrentUser())

  function handleLogout() {
    clearAuthToken()
    clearCurrentUser()
    setIsAuthed(false)
    setCurrentUserState(null)
    setContacts([])
    setCallHistory([])
    setQuery('')
    setActiveTab(TABS.CONTACTS)
    setEditingContact(null)
    setPendingDelete(null)
    setPendingDial(null)
  }

  function handleApiError(e) {
    if ((e?.message || '').toLowerCase().includes('unauthorized')) {
      handleLogout()
      return true
    }
    return false
  }

  function handleAuthSuccess({ token, user }) {
    setAuthToken(token)
    setCurrentUser(user)
    setCurrentUserState(user)
    setIsAuthed(true)
  }

  useEffect(() => {
    seedIfEmpty()
  }, [])

  useEffect(() => {
    if (!isAuthed) return
    ;(async () => {
      try {
        const [cts, calls] = await Promise.all([
          loadContacts(),
          loadCallHistory(),
        ])
        setContacts(cts)
        setCallHistory(calls)
      } catch (e) {
        if (!handleApiError(e)) console.error(e)
      }
    })()

    requestNotificationPermission().then(() => {})
  }, [isAuthed])

  const filteredContacts = useMemo(() => {
    if (!query.trim()) return contacts
    const q = query.toLowerCase()
    return contacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phones || []).some(p => p.toLowerCase().includes(q))
    )
  }, [contacts, query])

  async function handleAddContact(newContact) {
    try {
      const created = await createContact({ favorite: false, ...newContact })
      setContacts(prev => [created, ...prev])
      setActiveTab(TABS.CONTACTS)
    } catch (e) {
      if (!handleApiError(e)) {
        console.error(e)
        alert('Failed to save contact')
      }
    }
  }

  function handleEditContact(selectContact) {
    setEditingContact(selectContact)
    setActiveTab(TABS.EDIT)
  }

  async function handleUpdateContact(updated) {
    try {
      const saved = await apiUpdateContact(updated.id, updated)
      setContacts(prev => prev.map(c => (c.id === saved.id ? saved : c)))
      setEditingContact(null)
      setActiveTab(TABS.CONTACTS)
    } catch (e) {
      if (!handleApiError(e)) {
        console.error(e)
        alert('Failed to update contact')
      }
    }
  }

  async function toggleFavorite(contactId, value) {
    try {
      const saved = await apiToggleFavorite(contactId, value)
      setContacts(prev => prev.map(c => (c.id === saved.id ? saved : c)))
    } catch (e) {
      if (!handleApiError(e)) console.error(e)
    }
  }

  function requestDelete(contact) {
    setPendingDelete(contact)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    const id = pendingDelete.id
    try {
      await apiDeleteContact(id)
      setContacts(prev => prev.filter(c => c.id !== id))
    } catch (e) {
      if (!handleApiError(e)) {
        console.error(e)
        alert('Failed to delete contact')
      }
    }
    setPendingDelete(null)
  }

  function cancelDelete() {
    setPendingDelete(null)
  }

  async function logCall(contact, phone) {
    const entry = {
      type: 'outgoing',
      contactId: contact?.id || null,
      name: contact?.name || 'Unknown',
      phone,
      timestamp: Date.now(),
      durationSeconds: randomCallDurationSeconds(25, 180),
    }
    try {
      const saved = await logCallApi(entry)
      setCallHistory(prev => [saved, ...prev])
    } catch (e) {
      if (!handleApiError(e)) {
        console.error(e)
        // optimistic fallback
        setCallHistory(prev => [{ ...entry, id: generateId() }, ...prev])
      }
    }
  }

  function handleDial(contact, phone) {
    if (contact && (contact.phones?.length || 0) > 1 && !phone) {
      setPendingDial(contact)
      return
    }
    if (!phone) phone = contact?.phones?.[0]
    if (!phone) return
    
    // Log the call first
    logCall(contact, phone)
    
    // Try to initiate the call
    try {
      // Method 1: Use tel: protocol (works on mobile devices)
      const telUrl = `tel:${phone}`
      console.log('Initiating call to:', phone, 'via URL:', telUrl)
      
      // Create a temporary link and click it
      const link = document.createElement('a')
      link.href = telUrl
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Alternative method: try window.open
      setTimeout(() => {
        try {
          window.open(telUrl, '_self')
        } catch (e) {
          console.log('window.open failed, trying location.href')
          window.location.href = telUrl
        }
      }, 100)
      
    } catch (error) {
      console.error('Failed to initiate call:', error)
      // Fallback: show a message with the number
      alert(`Call failed. Please dial ${phone} manually.`)
    }
  }

  function openEditFromDetails(target) {
    if (!target) return
    // If target has an id treat as existing contact, otherwise prefill Add screen
    if (target.id) {
      handleEditContact(target)
    } else {
      setActiveTab(TABS.ADD)
      // We don't have a prop for prefill in AddContact; a quick approach is to store a temp draft in sessionStorage or extend AddContact.
      // Keeping simple for now: the user can hit Save and select storage target.
    }
  }

  // If not authenticated, show Auth screen
  if (!isAuthed) {
    return (
      <Auth onSuccess={handleAuthSuccess} />
    )
  }

  return (
    <div className="min-h-full flex flex-col bg-black text-white">
      {/* Unified Header: greeting + logout + contacts title + search */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="mx-auto px-3 md:px-4 py-2 space-y-2">
          {/* Top row: greeting and logout */}
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <span className="block truncate font-semibold text-sm md:text-base bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
                {currentUser?.name ? `Hello, ${currentUser.name}` : (currentUser?.email ? currentUser.email : '')}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-[12px] px-2.5 py-1 text-sm bg-[#1b1b1b] border border-white/10 text-gray-200 hover:text-white hover:bg-[#222] transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Contacts title and count */}
          <div>
            <h1 className="text-lg font-semibold leading-tight">Contacts</h1>
            <p className="text-xs text-gray-400 leading-tight">{contacts.length} contacts</p>
          </div>

          {/* Search input */}
          <div className="pr-8 sm:pr-10 md:pr-12 lg:pr-16">
            <label className="w-full flex items-center gap-2 bg-[#1b1b1b] rounded-2xl border border-white/10 px-3 py-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-400">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`${contacts.length} contacts`}
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-gray-500"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-500 px-1" aria-label="Clear">
                  ✕
                </button>
              )}
            </label>
          </div>

          {/* Optional: dial suggestion if query contains a phone */}
          {(() => {
            const digits = (query || '').replace(/[^0-9+]/g, '')
            if (digits.length >= 3) {
              return (
                <button
                  onClick={() => handleDial(null, digits)}
                  className="w-full text-left text-emerald-400 text-sm"
                >
                  Call {formatPhone(digits)}
                </button>
              )
            }
            return null
          })()}
        </div>
      </div>

      {/* Add top padding so content is not hidden behind fixed header */}
      <main className="flex-1 pb-28 pt-[170px] md:pt-[176px] safe-area-bottom h-full">
        {activeTab === TABS.CONTACTS && (
          <div className="h-full">
            <ContactsList
              contacts={filteredContacts}
              totalCount={contacts.length}
              query={query}
              onQueryChange={setQuery}
              onEdit={handleEditContact}
              onDelete={requestDelete}
              onDial={handleDial}
            />
          </div>
        )}

        {activeTab === TABS.ADD && (
          <AddContact onCancel={() => setActiveTab(TABS.CONTACTS)} onSave={handleAddContact} />
        )}

        {activeTab === TABS.EDIT && editingContact && (
          <EditContact
            contact={editingContact}
            onCancel={() => {
              setEditingContact(null)
              setActiveTab(TABS.CONTACTS)
            }}
            onSave={handleUpdateContact}
          />
        )}

        {activeTab === TABS.HISTORY && (
          <CallHistory
            callHistory={callHistory}
            contacts={contacts}
            onDial={handleDial}
            onOpenDetails={openEditFromDetails}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>

      <Navbar
        active={activeTab}
        onChange={setActiveTab}
        tabs={TABS}
      />

      {activeTab !== TABS.ADD && activeTab !== TABS.HISTORY && (
        <FAB ariaLabel="Add contact" onClick={() => setActiveTab(TABS.ADD)} />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete contact?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <DialerDialog
        contact={pendingDial}
        onClose={() => setPendingDial(null)}
        onDial={(c, p) => {
          setPendingDial(null)
          handleDial(c, p)
        }}
      />
    </div>
  )
}