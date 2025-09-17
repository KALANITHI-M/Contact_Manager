import React, { useState } from 'react'
import ContactForm from './ContactForm.jsx'

export default function AddContact({ onCancel, onSave }) {
  const formId = 'add-contact-form'
  const [pendingValues, setPendingValues] = useState(null)

  function handleSubmit(values) {
    setPendingValues(values)
    // Direct save via API (handled in parent onSave)
    onSave(values)
  }


  return (
    <section>
      <header className="px-4 pt-4 pb-3 sticky top-0 z-10 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={onCancel} aria-label="Back" className="h-10 w-10 grid place-items-center text-gray-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-lg font-semibold">New contact</h1>
          <button form={formId} type="submit" className="px-3 h-10 rounded-xl bg-emerald-500 text-white">Save</button>
        </div>
      </header>

      <ContactForm formId={formId} onCancel={onCancel} onSubmit={handleSubmit} submitLabel="Add" showFooter={false} />
    </section>
  )
}
