"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { truncateAddress } from '@/lib/constants'
import { useTranslations } from 'next-intl'

export function WalletButtonCustom({ variant = 'default' }: { variant?: 'default' | 'ghost' }) {
  const t = useTranslations('actions')
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain
        if (!connected)
          return (
            <button
              onClick={openConnectModal}
              className={
                variant === 'ghost'
                  ? 'h-9 px-3 rounded-md text-white/90 hover:text-white text-sm flex items-center'
                  : 'h-9 px-3 rounded-md border hover:bg-gray-50 text-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-sm flex items-center'
              }
            >
              {t('connect_wallet')}
            </button>
          )
        if (chain?.unsupported)
          return (
            <button onClick={openChainModal} className={variant==='ghost' ? 'h-9 px-3 rounded-md text-amber-200 hover:text-amber-100 text-sm flex items-center' : 'h-9 px-3 rounded-md bg-amber-500 text-white text-sm flex items-center'}>
              {t('switch_network', { default: 'Switch Network' })}
            </button>
          )
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={openChainModal}
              className={
                variant === 'ghost'
                  ? 'h-9 px-3 rounded-md text-white/90 hover:text-white text-sm flex items-center'
                  : 'h-9 px-3 rounded-md border hover:bg-gray-50 text-sm text-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 flex items-center'
              }
            >
              {chain?.name ?? 'Chain'}
            </button>
            <button
              onClick={openAccountModal}
              className={
                variant === 'ghost'
                  ? 'h-9 px-3 rounded-md text-white/90 hover:text-white text-sm flex items-center'
                  : 'h-9 px-3 rounded-md border hover:bg-gray-50 text-sm text-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 flex items-center'
              }
            >
              {truncateAddress(account?.address)}
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
