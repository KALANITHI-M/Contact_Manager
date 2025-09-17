import { generateId } from '../utils/id.js'

export function getSeedData() {
  const contacts = [
    {
      id: generateId(),
      name: 'Leslie Alexander',
      email: 'leslie@example.com',
      phones: ['+1 555 010 1111'],
    },
    {
      id: generateId(),
      name: 'Courtney Henry',
      email: 'courtney@example.com',
      phones: ['+1 555 010 2222', '+1 555 010 3333'],
    },
    {
      id: generateId(),
      name: 'Jacob Jones',
      email: 'jacob@example.com',
      phones: ['+1 555 010 4444'],
    },
  ]

  const callHistory = [
    {
      id: generateId(),
      type: 'incoming',
      contactId: contacts[0].id,
      name: contacts[0].name,
      phone: contacts[0].phones[0],
      timestamp: Date.now() - 1000 * 60 * 45,
      durationSeconds: 75,
    },
    {
      id: generateId(),
      type: 'missed',
      contactId: contacts[1].id,
      name: contacts[1].name,
      phone: contacts[1].phones[0],
      timestamp: Date.now() - 1000 * 60 * 60 * 6,
      durationSeconds: 0,
    },
    {
      id: generateId(),
      type: 'outgoing',
      contactId: contacts[2].id,
      name: contacts[2].name,
      phone: contacts[2].phones[0],
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
      durationSeconds: 140,
    },
  ]

  return { contacts, callHistory }
}
