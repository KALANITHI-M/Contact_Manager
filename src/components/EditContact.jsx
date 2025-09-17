import React from 'react'
import ContactForm from './ContactForm.jsx'

export default function EditContact({ contact, onCancel, onSave }) {
  function handleSubmit(values) {
    onSave({ ...contact, ...values })
  }
  return (
    <section>
      <header className="px-4 pt-6">
        <h1 className="text-xl font-semibold">Edit Contact</h1>
      </header>
      <ContactForm initial={contact} onCancel={onCancel} onSubmit={handleSubmit} submitLabel="Save changes" />
    </section>
  )
}
