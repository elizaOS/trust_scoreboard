import { useState, useEffect } from "react"
export type TTransaction = {
  hash: string
  tokenAddr: string
  tokenName: string
  amount: string
  type: "sell" | "buy"
  uiAmount: string
}

export type TTrade = {
  id: number
  tokenAddr: string
  tokenName: string
  logoURI?: string
  decimals: number
  bundleSignature: string
  amount: string
  createdAt: string
  updatedAt: string
  transactions: TTransaction[]
  uiAmount: string
}

export const useGetTrades = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [trades, setTrades] = useState<TTrade[]>([])

  const getUsers = async () => {
    const response = await fetch(`/api/trades/getDaoTrades`)

    setIsLoading(false)
    const data = await response.json()

    setTrades(data)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return { trades, isLoading }
}
