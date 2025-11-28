// components/sample.tsx
"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useNotesContract } from "@/hooks/useContract"

const SampleIntegration = () => {
  const { isConnected } = useAccount()
  const [noteInput, setNoteInput] = useState("")

  const { data, actions, state } = useNotesContract()

  const handleAddNote = async () => {
    if (!noteInput) return
    try {
      await actions.addNote(noteInput)
      setNoteInput("")
    } catch (err) {
      console.error("Error:", err)
    }
  }

  useEffect(() => {
    actions.fetchNotes()
  }, [])

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-3">Meeting Notes</h2>
          <p>Please connect your wallet to interact.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meeting Notes</h1>

      {/* Notes Count */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">Total Notes</p>
        <p className="text-2xl font-semibold">{data.notesCount}</p>
      </div>

      {/* Add Note */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Write a meeting note..."
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleAddNote}
          disabled={state.isLoading || state.isPending || !noteInput}
          className="w-full px-6 py-2 bg-primary text-white rounded-lg"
        >
          {state.isLoading ? "Saving..." : "Add Note"}
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {data.notes.map((note, idx) => (
          <div key={idx} className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">
              Author: {note.author}
            </p>
            <p>{note.content}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(note.timestamp * 1000).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Status */}
      {state.hash && (
        <div className="mt-6 p-4 border rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
          <p className="text-sm break-all">{state.hash}</p>
        </div>
      )}

      {state.error && (
        <div className="mt-6 p-4 border rounded-lg text-red-500">
          Error: {state.error.message}
        </div>
      )}
    </div>
  )
}

export default SampleIntegration
