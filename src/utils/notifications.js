// Notification utilities for the contact manager

export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return Promise.resolve(false)
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true)
  }

  if (Notification.permission === 'denied') {
    return Promise.resolve(false)
  }

  return Notification.requestPermission().then(permission => {
    return permission === 'granted'
  })
}

export function showMissedCallNotification(contactName, phoneNumber) {
  if (Notification.permission !== 'granted') return

  const notification = new Notification('Missed Call', {
    body: `${contactName || phoneNumber} tried to call you`,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'missed-call',
    requireInteraction: true,
    actions: [
      {
        action: 'call-back',
        title: 'Call Back',
        icon: '/favicon.svg'
      },
      {
        action: 'view-contact',
        title: 'View Contact',
        icon: '/favicon.svg'
      }
    ]
  })

  notification.onclick = function(event) {
    event.preventDefault()
    window.focus()
    // You can add navigation logic here
  }

  notification.onaction = function(event) {
    if (event.action === 'call-back') {
      window.location.href = `tel:${phoneNumber}`
    } else if (event.action === 'view-contact') {
      // Navigate to contact details
      window.focus()
    }
  }

  return notification
}

export function showCallForwardingNotification(contactName, forwardNumber) {
  if (Notification.permission !== 'granted') return

  new Notification('Call Forwarding Set', {
    body: `Calls to ${contactName} will be forwarded to ${forwardNumber}`,
    icon: '/favicon.svg',
    tag: 'call-forwarding'
  })
}

export function showIncomingCallAlert(contactName, phoneNumber) {
  // Create a custom alert since we can't intercept actual calls
  const alertDiv = document.createElement('div')
  alertDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80'
  alertDiv.innerHTML = `
    <div class="bg-[#111] rounded-2xl p-6 mx-4 max-w-sm w-full border border-white/10">
      <div class="text-center">
        <div class="w-16 h-16 rounded-full bg-emerald-500 mx-auto mb-4 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M6 3l3 3-2 2c1.5 3 4 5.5 7 7l2-2 3 3-2 3c-6-.5-12.5-7-13-13L6 3z" fill="white"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Incoming Call</h3>
        <p class="text-lg mb-1">${contactName || phoneNumber}</p>
        <p class="text-gray-400 text-sm mb-6">${phoneNumber}</p>
        <div class="flex gap-3">
          <button id="answer-call" class="flex-1 h-12 rounded-xl bg-emerald-500 text-white font-medium">
            Answer
          </button>
          <button id="decline-call" class="flex-1 h-12 rounded-xl bg-rose-500 text-white font-medium">
            Decline
          </button>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(alertDiv)

  // Auto-remove after 30 seconds
  setTimeout(() => {
    if (document.body.contains(alertDiv)) {
      document.body.removeChild(alertDiv)
    }
  }, 30000)

  // Handle button clicks
  alertDiv.querySelector('#answer-call').onclick = () => {
    document.body.removeChild(alertDiv)
    window.location.href = `tel:${phoneNumber}`
  }

  alertDiv.querySelector('#decline-call').onclick = () => {
    document.body.removeChild(alertDiv)
    // Log as missed call
    showMissedCallNotification(contactName, phoneNumber)
  }

  return alertDiv
}
