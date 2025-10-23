export function formatCurrency(value: number, currency: 'USD' | 'EUR' | 'CNY' = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}

