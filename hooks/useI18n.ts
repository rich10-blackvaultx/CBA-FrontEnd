import { useLocale, useTranslations } from 'next-intl'

export function useI18n(ns?: string) {
  const t = useTranslations(ns)
  const locale = useLocale()
  return { t, locale }
}

