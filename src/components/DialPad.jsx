import React, { useEffect, useRef, useState } from 'react'

const KEYS = [
  [{ d: '1', s: '' }, { d: '2', s: 'ABC' }, { d: '3', s: 'DEF' }],
  [{ d: '4', s: 'GHI' }, { d: '5', s: 'JKL' }, { d: '6', s: 'MNO' }],
  [{ d: '7', s: 'PQRS' }, { d: '8', s: 'TUV' }, { d: '9', s: 'WXYZ' }],
  [{ d: '*', s: '' }, { d: '0', s: '+' }, { d: '#', s: '' }],
]

export default function DialPad({ onDial }) {
  const [value, setValue] = useState('')
  const holdTimer = useRef(null)

  function append(ch) {
    if (ch === '0' && holdTimer.current === 'holdZero') {
      setValue(v => v + '+')
    } else {
      setValue(v => v + ch)
    }
  }

  function backspace(all = false) {
    setValue(v => (all ? '' : v.slice(0, -1)))
  }

  function handleDial() {
    const num = value.trim()
    if (!num) return
    onDial(null, num)
    setValue('')
  }

  function onKeyDown(e) {
    const k = e.key
    if (/^[0-9*#+]$/.test(k)) setValue(v => v + k)
    if (k === 'Backspace') backspace(false)
    if (k === 'Enter') handleDial()
  }

  useEffect(() => {
    const onDocKey = (e) => onKeyDown(e)
    document.addEventListener('keydown', onDocKey)
    return () => document.removeEventListener('keydown', onDocKey)
  }, [])

  return (
    <div className="fixed left-0 right-0 bottom-16 safe-area-bottom z-20">
      <div className="mx-auto max-w-md px-4 pb-2">
        <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 p-3">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="text-xl tracking-wider tabular-nums select-text break-all pr-2 min-h-[28px]">{value || '\u00A0'}</div>
            <button
              aria-label="Backspace"
              onClick={() => backspace(false)}
              onMouseDown={() => { holdTimer.current = setTimeout(() => backspace(true), 600) }}
              onMouseUp={() => { clearTimeout(holdTimer.current); holdTimer.current = null }}
              onMouseLeave={() => { clearTimeout(holdTimer.current); holdTimer.current = null }}
              className="h-10 w-10 grid place-items-center text-gray-300 hover:text-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M10 7l-5 5 5 5h9a2 2 0 002-2V9a2 2 0 00-2-2h-9z" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 10l4 4M16 10l-4 4" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
            </button>
          </div>

          <div className="mt-1 grid grid-cols-3 gap-2">
            {KEYS.flat().map(({ d, s }, idx) => (
              <button
                key={idx}
                onClick={() => append(d)}
                onMouseDown={() => { if (d === '0') holdTimer.current = 'holdZero' }}
                onMouseUp={() => { holdTimer.current = null }}
                className="h-14 rounded-2xl bg-[#222] active:bg-[#2a2a2a] text-white flex flex-col items-center justify-center"
              >
                <span className="text-xl font-medium">{d}</span>
                {s && <span className="text-[10px] text-gray-400">{s}</span>}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center">
            <button
              onClick={handleDial}
              className="h-14 w-14 rounded-full bg-emerald-500 text-white grid place-items-center active:scale-95"
              aria-label="Call"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 3l3 3-2 2c1.5 3 4 5.5 7 7l2-2 3 3-2 3c-6-.5-12.5-7-13-13L6 3z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
