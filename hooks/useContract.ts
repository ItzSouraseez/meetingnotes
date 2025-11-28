// hooks/useContract.ts
"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractABI, contractAddress } from "@/lib/contract"

export interface NoteData {
  author: string
  content: string
  timestamp: number
}

export interface ContractData {
  notesCount: number
  notes: NoteData[]
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractActions {
  addNote: (content: string) => Promise<void>
  fetchNotes: () => Promise<void>
}

export const useNotesContract = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState<NoteData[]>([])

  const { data: notesCount, refetch: refetchNotesCount } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getNotesCount",
  })

  const { writeContractAsync, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isConfirmed) {
      refetchNotesCount()
      fetchNotes()
    }
  }, [isConfirmed, refetchNotesCount])

  const addNote = async (content: string) => {
    if (!content) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "addNote",
        args: [content],
      })
    } catch (err) {
      console.error("Error adding note:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNotes = async () => {
    try {
      if (!notesCount) return
      const total = Number(notesCount as bigint)

      const _notes: NoteData[] = []
      for (let i = 0; i < total; i++) {
        const result = await (window as any).ethereum?.request({
          method: "eth_call",
          params: [
            {
              to: contractAddress,
              data:
                "0x" +
                (await import("viem")).encodeFunctionData({
                  abi: contractABI,
                  functionName: "getNote",
                  args: [BigInt(i)],
                }).slice(2),
            },
            "latest",
          ],
        })
      }
    } catch (err) {
      console.error("Error fetching notes:", err)
    }
  }

  const data: ContractData = {
    notesCount: notesCount ? Number(notesCount as bigint) : 0,
    notes,
  }

  const actions: ContractActions = {
    addNote,
    fetchNotes,
  }

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }

  return { data, actions, state }
}
