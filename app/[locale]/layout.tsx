import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { NavbarIntl as Navbar } from '@/components/layout/NavbarIntl'
import { Footer } from '@/components/layout/Footer'
import { Web3Provider } from '@/components/providers/Web3Provider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { NIOverlay } from '@/components/shared/NIOverlay'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Glomia Life',
  description: 'Explore bases, nodes and stories across the world'
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  let messages
  try {
    // Use relative dynamic import to avoid alias resolution issues
    messages = (await import(`../../i18n/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* React Query must wrap RainbowKitProvider */}
      <QueryProvider>
        <Web3Provider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <NIOverlay />
        </Web3Provider>
      </QueryProvider>
    </NextIntlClientProvider>
  )
}
