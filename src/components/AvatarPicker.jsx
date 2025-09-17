import React, { useRef } from 'react'

export default function AvatarPicker({ value, onChange, size = 80 }) {
  const inputRef = useRef(null)

  function pickFile() {
    inputRef.current?.click()
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onChange(String(reader.result))
    }
    reader.readAsDataURL(file)
  }

  function clearPhoto() {
    onChange('')
  }

  const dim = `${size}px`

  return (
    <div className="flex items-center gap-3">
      <div
        className="rounded-full overflow-hidden bg-neutral-800 grid place-items-center border border-white/10"
        style={{ width: dim, height: dim }}
        onClick={pickFile}
        role="button"
        aria-label="Change photo"
      >
        {value ? (
          <img src={value} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <svg width={Math.min(size * 0.45, 36)} height={Math.min(size * 0.45, 36)} viewBox="0 0 24 24" className="text-gray-400">
            <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M6.5 19c1-3.2 3.6-4.8 5.5-4.8s4.5 1.6 5.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <div className="flex flex-col">
        <button type="button" onClick={pickFile} className="text-emerald-400 text-sm">{value ? 'Change photo' : 'Add a photo'}</button>
        {value && (
          <button type="button" onClick={clearPhoto} className="text-gray-400 text-xs text-left">Remove</button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
