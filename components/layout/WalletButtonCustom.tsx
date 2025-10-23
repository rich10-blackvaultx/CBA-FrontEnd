"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { truncateAddress } from '@/lib/constants'
import { useTranslations } from 'next-intl'

export function WalletButtonCustom() {
  const t = useTranslations('actions')
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain
        if (!connected)
          return (
            <button
              onClick={openConnectModal}
              className="px-3 py-2 rounded-md border hover:bg-gray-50 text-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {t('connect_wallet')}
            </button>
          )
        if (chain?.unsupported)
          return (
            <button onClick={openChainModal} className="px-3 py-2 rounded-md bg-amber-500 text-white">
              {t('switch_network', { default: 'Switch Network' })}
            </button>
          )
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={openChainModal}
              className="px-2 py-2 rounded-md border hover:bg-gray-50 text-sm text-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {chain?.name ?? 'Chain'}
            </button>
            <button
              onClick={openAccountModal}
              className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm text-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {truncateAddress(account?.address)}
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
