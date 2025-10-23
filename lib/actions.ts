'use server'

import { revalidatePath } from 'next/cache'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

function dataPath(file: string) {
  return path.join(process.cwd(), 'app', 'api', '_data', file)
}

export async function createActivityAction(formData: FormData) {
  const entry = {
    id: randomUUID(),
    title: String(formData.get('title') ?? ''),
    intro: String(formData.get('intro') ?? ''),
    nodeId: String(formData.get('nodeId') ?? ''),
    baseId: String(formData.get('baseId') ?? ''),
    quota: Number(formData.get('quota') ?? 0),
    startAt: String(formData.get('startAt') ?? new Date().toISOString()),
    endAt: String(formData.get('endAt') ?? new Date().toISOString()),
    price: Number(formData.get('price') ?? 0),
    poster: String(formData.get('poster') ?? ''),
    creator: String(formData.get('creator') ?? '')
  }

  const file = dataPath('activities.json')
  try {
    const buf = await fs.readFile(file, 'utf-8')
    const list = JSON.parse(buf) as any[]
    list.unshift(entry)
    await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8')
  } catch (e) {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify([entry], null, 2), 'utf-8')
  }
  // Revalidate activities API and page
  revalidatePath('/api/activities')
  revalidatePath('/[locale]/create/activity')
  return { ok: true, id: entry.id }
}

// Placeholder: to be replaced by real chain signature flow
export async function signMessageAction(message: string) {
  // In server actions we cannot request a wallet signature.
  // This is only a placeholder returning the message to sign client-side.
  return { message, note: 'Please sign this message in your wallet (client-side).' }
}

