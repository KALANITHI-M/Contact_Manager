export function formatDuration(seconds = 0) {
  const s = Math.max(0, Math.floor(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`
}

export function formatDateTime(timestamp) {
  try {
    const d = new Date(timestamp)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export function formatPhone(p = '') {
  return p
}

export function randomCallDurationSeconds(min = 20, max = 120) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
