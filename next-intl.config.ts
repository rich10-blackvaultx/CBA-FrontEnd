import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  return {
    // Explicitly return the resolved locale (required by recent next-intl versions)
    locale,
    messages: (await import(`./i18n/${locale}.json`)).default
  }
})
