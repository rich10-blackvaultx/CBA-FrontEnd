'use server'

import { revalidatePath } from 'next/cache'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

function dataPath(file: string) {
  return path.join(process.cwd(), 'app', 'api', '_data', file)
}

export async function createActivityAction(formData: FormData) {
  const input = {
    title: String(formData.get('title') ?? ''),
    tagline: String(formData.get('tagline') ?? ''),
    desc: String(formData.get('desc') ?? ''),
    baseId: String(formData.get('baseId') ?? ''),
    nodeId: String(formData.get('nodeId') ?? ''),
    poster: String(formData.get('poster') ?? ''),
    startAt: String(formData.get('startAt') ?? new Date().toISOString()),
    endAt: String(formData.get('endAt') ?? new Date().toISOString()),
    timezone: String(formData.get('timezone') ?? '+00:00'),
    host: String(formData.get('host') ?? ''),
    hostAvatar: String(formData.get('hostAvatar') ?? ''),
    identityTags: (String(formData.get('identityTags') ?? '') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    ticket: JSON.parse(String(formData.get('ticket') ?? '{"type":"free","quota":1}')),
    tags: (String(formData.get('tags') ?? '') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    locationNote: String(formData.get('locationNote') ?? '')
  }

  const file = dataPath('activities.json')
  const creator = String(formData.get('creatorAddress') ?? formData.get('creator') ?? '')
  const entry = {
    ...input,
    id: randomUUID(),
    status: 'pending',
    creatorAddress: creator,
    createdAt: new Date().toISOString(),
    signups: creator ? [{ address: creator, status: 'confirmed' }] : []
  }

  try {
    const buf = await fs.readFile(file, 'utf-8')
    const list = JSON.parse(buf) as any[]
    list.unshift(entry)
    await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8')
  } catch (e) {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify([entry], null, 2), 'utf-8')
  }
  revalidatePath('/api/activities')
  revalidatePath('/[locale]/create/activity')
  return entry
}

// Placeholder: to be replaced by real chain signature flow
export async function signMessageAction(message: string) {
  // In server actions we cannot request a wallet signature.
  // This is only a placeholder returning the message to sign client-side.
  return { message, note: 'Please sign this message in your wallet (client-side).' }
}
