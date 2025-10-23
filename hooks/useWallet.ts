"use client"

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function useWallet() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const activeConnector = connectors?.[0]
  return {
    address,
    isConnected,
    chainId,
    connect: () => connect({ connector: activeConnector }),
    disconnect,
    status,
    error
  }
}
