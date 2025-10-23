import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localeDetection: true
})

export const config = {
  matcher: [
    '/',
    '/(zh|en)/:path*',
    '/((?!_next|_vercel|favicon.ico|api).*)'
  ]
}

