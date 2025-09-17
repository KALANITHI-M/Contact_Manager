import React, { useRef } from 'react'

const LETTERS = ['★', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), '#']

export default function AlphaIndexBar({ onJump }) {
  const isTouchingRef = useRef(false)

  function jumpFromEl(el) {
    const target = el?.closest('[data-letter]')
    if (!target) return
    const letter = target.getAttribute('data-letter')
    onJump(letter)
  }

  function handleMouseDown(e) {
    isTouchingRef.current = true
    jumpFromEl(e.target)
  }

  function handleMouseUp() {
    isTouchingRef.current = false
  }

  function handleMouseMove(e) {
    if (!isTouchingRef.current) return
    jumpFromEl(document.elementFromPoint(e.clientX, e.clientY))
  }

  function handleTouchStart(e) {
    isTouchingRef.current = true
    const t = e.touches[0]
    jumpFromEl(document.elementFromPoint(t.clientX, t.clientY))
  }

  function handleTouchMove(e) {
    const t = e.touches[0]
    jumpFromEl(document.elementFromPoint(t.clientX, t.clientY))
  }

  function handleTouchEnd() {
    isTouchingRef.current = false
  }

  return (
    <div
      className="fixed right-2 top-[150px] sm:top-[158px] md:top-[166px] bottom-[84px] sm:bottom-[90px] pointer-events-none select-none z-10"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="h-full w-7 sm:w-8 md:w-9 flex flex-col items-center justify-between text-[10px] sm:text-[11px] text-gray-400 rounded-md bg-black/0 pointer-events-auto py-1">
        {LETTERS.map((l, index) => (
          <button
            key={l}
            data-letter={l}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="flex-1 w-full grid place-items-center hover:text-white transition-colors"
            aria-label={`Jump to ${l}`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}
