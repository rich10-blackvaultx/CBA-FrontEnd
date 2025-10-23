import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  const lng = (locale || 'en') as string
  return {
    locale: lng,
    messages: (await import(`./i18n/${lng}.json`)).default
  }
})
