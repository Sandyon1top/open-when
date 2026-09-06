import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Trash2, Heart } from 'lucide-react'
import { loadContacts, saveContact, deleteContact } from '../utils/contactStorage'

export default function ContactsModal({ isOpen, onClose, onSelect }) {
  const [contacts, setContacts] = useState([])
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (isOpen) setContacts(loadContacts())
  }, [isOpen])

  const handleAdd = (e) => {
    e.preventDefault()
    if (newName.trim()) {
      saveContact(newName.trim())
      setContacts(loadContacts())
      setNewName('')
    }
  }

  const handleDelete = (name) => {
    deleteContact(name)
    setContacts(loadContacts())
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-5"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#5c4a55] dark:text-gray-100 flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-400 fill-rose-300" /> My Contacts
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {contacts.length === 0 ? (
                <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
                  No contacts yet. Add one below!
                </p>
              ) : (
                contacts.map((name) => (
                  <div key={name} className="flex items-center justify-between rounded-2xl bg-rose-50 dark:bg-gray-800 px-4 py-2.5 border border-rose-100 dark:border-gray-700">
                    <button
                      className="text-sm font-semibold text-[#5c4a55] dark:text-gray-100 hover:text-rose-500 transition"
                      onClick={() => { onSelect(name); onClose() }}
                    >
                      {name}
                    </button>
                    <button onClick={() => handleDelete(name)} className="text-gray-300 hover:text-red-400 transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAdd} className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Add a new contact..."
                className="flex-1 rounded-xl border border-rose-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-[#5c4a55] dark:text-gray-100 focus:border-rose-400 focus:outline-none"
              />
              <button type="submit" className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 px-3 py-2 text-xs font-bold text-white shadow hover:opacity-90 transition">
                <UserPlus className="h-4 w-4" /> Add
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
