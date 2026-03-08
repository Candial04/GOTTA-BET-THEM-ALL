import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Bet {
  id: string
  amount: number
  result: string
  win: number
  timestamp: string
}

interface CasinoState {
  balance: number
  bets: Bet[]
  addBet: (bet: Omit<Bet, 'id' | 'timestamp'>) => void
  winCoins: (amount: number) => void
  loseCoins: (amount: number) => void
}

export const useCasinoStore = create<CasinoState>()(
  persist(
    (set) => ({
      balance: 1000,
      bets: [],
      addBet: (bet) =>
        set((state) => ({
          bets: [
            ...state.bets,
            { ...bet, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
          ],
        })),
      winCoins: (amount) =>
        set((state) => ({ balance: state.balance + amount })),
      loseCoins: (amount) =>
        set((state) => ({ balance: Math.max(0, state.balance - amount) })),
    }),
    { name: 'casino-storage' }
  )
)