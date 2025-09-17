import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*'
app.use(cors({ origin: FRONTEND_ORIGIN }))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/contact_manager'
try {
  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
} catch (e) {
  console.error('MongoDB connection error:', e.message)
}

const ContactSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phones: { type: [String], default: [] },
  avatar: { type: String, default: '' },
  favorite: { type: Boolean, default: false },
}, { timestamps: true })

// Normalize id in JSON
ContactSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
}, { timestamps: true })

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.passwordHash
    delete ret.salt
    return ret
  }
})

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex')
}

function signToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me'
  return jwt.verify(token, secret)
}

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

const CallLogSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  type: { type: String, enum: ['incoming', 'outgoing', 'missed'], required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', default: null },
  name: { type: String, default: '' },
  phone: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  durationSeconds: { type: Number, default: 0 },
}, { timestamps: true })

CallLogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

const Contact = mongoose.model('Contact', ContactSchema)
const User = mongoose.model('User', UserSchema)
const CallLog = mongoose.model('CallLog', CallLogSchema)

// Auth
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'Email already registered' })
    const salt = generateSalt()
    const passwordHash = hashPassword(password, salt)
    const user = await User.create({ email, name, passwordHash, salt })
    const token = signToken({ userId: user.id })
    res.status(201).json({ token, user })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const passwordHash = hashPassword(password, user.salt)
    if (passwordHash !== user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' })
    const token = signToken({ userId: user.id })
    res.json({ token, user })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Contacts (scoped)
app.get('/api/contacts', authMiddleware, async (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase()
  const all = await Contact.find({ ownerId: req.user.userId }).sort({ favorite: -1, name: 1 })
  const filtered = q
    ? all.filter(c => (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        (c.phones || []).some(p => p.toLowerCase().includes(q))
      ))
    : all
  res.json(filtered)
})

app.post('/api/contacts', authMiddleware, async (req, res) => {
  try {
    const payload = { ...req.body, ownerId: req.user.userId }
    const created = await Contact.create(payload)
    res.status(201).json(created)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.put('/api/contacts/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Contact.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.userId }, req.body, { new: true })
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.delete('/api/contacts/:id', authMiddleware, async (req, res) => {
  try {
    await Contact.findOneAndDelete({ _id: req.params.id, ownerId: req.user.userId })
    res.json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Favorites toggle
app.post('/api/contacts/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body
    const contact = await Contact.findOne({ _id: req.params.id, ownerId: req.user.userId })
    if (!contact) return res.status(404).json({ error: 'Not found' })
    contact.favorite = typeof value === 'boolean' ? value : !contact.favorite
    await contact.save()
    res.json(contact)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Call logs
app.get('/api/calls', authMiddleware, async (req, res) => {
  const logs = await CallLog.find({ ownerId: req.user.userId }).sort({ timestamp: -1 }).limit(200)
  res.json(logs)
})

app.post('/api/calls', authMiddleware, async (req, res) => {
  try {
    const created = await CallLog.create({ ...req.body, ownerId: req.user.userId })
    res.status(201).json(created)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

async function migrateOwnerIds() {
  try {
    const stringContacts = await Contact.find({ ownerId: { $type: 'string' } }).select('_id ownerId')
    for (const doc of stringContacts) {
      try {
        const oid = new mongoose.Types.ObjectId(doc.ownerId)
        await Contact.updateOne({ _id: doc._id }, { $set: { ownerId: oid } })
      } catch (e) {
        console.warn('Skipping contact with invalid ownerId string', doc._id)
      }
    }
    const stringLogs = await CallLog.find({ ownerId: { $type: 'string' } }).select('_id ownerId')
    for (const doc of stringLogs) {
      try {
        const oid = new mongoose.Types.ObjectId(doc.ownerId)
        await CallLog.updateOne({ _id: doc._id }, { $set: { ownerId: oid } })
      } catch (e) {
        console.warn('Skipping call log with invalid ownerId string', doc._id)
      }
    }
    if (stringContacts.length || stringLogs.length) {
      console.log(`Migrated ownerId types - contacts: ${stringContacts.length}, call logs: ${stringLogs.length}`)
    }
  } catch (e) {
    console.warn('Migration error:', e.message)
  }
}

// Run lightweight migration on startup (non-blocking)
try { migrateOwnerIds() } catch {}

const port = process.env.PORT || 4000
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on http://localhost:${port}`)
})


