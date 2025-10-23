export type FetchOptions = RequestInit & { retry?: number; timeoutMs?: number }

async function withTimeout<T>(p: Promise<T>, ms = 10000): Promise<T> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(new Error('Timeout')), ms)
  try {
    // @ts-ignore
    const res = await p
    clearTimeout(t)
    return res
  } catch (e) {
    clearTimeout(t)
    throw e
  }
}

export async function http<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { retry = 1, timeoutMs = 10000, ...rest } = options
  let lastError: any
  for (let i = 0; i <= retry; i++) {
    try {
      const res = await withTimeout(fetch(url, { ...rest }), timeoutMs)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return (await res.json()) as T
    } catch (e) {
      lastError = e
      if (i === retry) throw e
      await new Promise((r) => setTimeout(r, 250 * (i + 1)))
    }
  }
  throw lastError
}

export const getJSON = <T>(url: string, options?: FetchOptions) => http<T>(url, options)
export const postJSON = <T>(url: string, body: any, options?: FetchOptions) =>
  http<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    ...(options || {})
  })

