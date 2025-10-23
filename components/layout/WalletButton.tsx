"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { truncateAddress } from '@/lib/constants'
import { useWallet } from '@/hooks/useWallet'

export function WalletButton() {
  const { address, isConnected } = useWallet()
  return (
    <div className="flex items-center">
      <ConnectButton accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
      {isConnected && address && (
        <span className="ml-2 hidden sm:inline text-xs text-gray-500">{truncateAddress(address)}</span>
      )}
    </div>
  )
}
