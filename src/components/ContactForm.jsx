import React, { useState } from 'react'
import PhoneNumbersInput from './PhoneNumbersInput.jsx'
import AvatarPicker from './AvatarPicker.jsx'

export default function ContactForm({
  initial = { name: '', email: '', phones: [''], avatar: '' },
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  formId,
  showFooter = true,
}) {
  const [name, setName] = useState(initial.name || '')
  const [email, setEmail] = useState(initial.email || '')
  const [phones, setPhones] = useState(initial.phones?.length ? initial.phones : [''])
  const [avatar, setAvatar] = useState(initial.avatar || '')

  function handleSubmit(e) {
    e.preventDefault()
    const cleaned = phones.map(p => p.trim()).filter(Boolean)
    onSubmit({ name: name.trim(), email: email.trim(), phones: cleaned, avatar })
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="px-4 pt-4 pb-6 space-y-4 max-w-md mx-auto">
      <div className="rounded-2xl p-4 border border-white/10 bg-[#111] shadow-card space-y-5">
        <AvatarPicker value={avatar} onChange={setAvatar} />

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full bg-[#1b1b1b] text-white border border-white/10 rounded-xl px-3 py-3 outline-emerald-500 placeholder:text-gray-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-[#1b1b1b] text-white border border-white/10 rounded-xl px-3 py-3 outline-emerald-500 placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Phone numbers</label>
          <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-3">
            <PhoneNumbersInput phones={phones} onChange={setPhones} />
          </div>
        </div>
      </div>

      {showFooter && (
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="flex-1 h-12 rounded-xl border border-white/15 text-gray-300 active:scale-[0.98]">
            Cancel
          </button>
          <button type="submit" className="flex-1 h-12 rounded-xl bg-emerald-500 text-white active:scale-[0.98]">
            {submitLabel}
          </button>
        </div>
      )}
    </form>
  )
}
