import { loadFromStorage, saveToStorage } from '../utils/storage.js'

/**
 * Note shape:
 * { id: string, title: string, content: string, createdAt: number, updatedAt: number }
 */

const listeners = new Set()

let state = {
  notes: [],
  selectedId: null,
  search: '',
  sort: 'updatedAt', // only one sort for now
  editing: false,
}

function notify() {
  const snapshot = getState()
  listeners.forEach((fn) => {
    try {
      fn(snapshot)
    } catch (err) {
      console.error('Subscriber error:', err)
    }
  })
}

function persist() {
  saveToStorage({ notes: state.notes })
}

/**
 * Initialize from storage (if any)
 */
function init() {
  const stored = loadFromStorage()
  if (stored && Array.isArray(stored.notes)) {
    state.notes = stored.notes
    // Select most recently updated
    if (state.notes.length > 0) {
      state.notes.sort((a, b) => b.updatedAt - a.updatedAt)
      state.selectedId = state.notes[0].id
    }
  } else {
    // Seed with an example note
    const now = Date.now()
    const example = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(now),
      title: 'Welcome to Simple Notes',
      content:
        'This is your first note. Use + New Note to create, click a note to view, and press Edit to modify.\n\nShortcuts:\n- Ctrl/Cmd + N: New note\n- Ctrl/Cmd + S: Save when editing',
      createdAt: now,
      updatedAt: now,
    }
    state.notes = [example]
    state.selectedId = example.id
    persist()
  }
}

init()

// PUBLIC_INTERFACE
export function subscribe(listener) {
  /** Subscribe to store updates */
  listeners.add(listener)
  // immediate call with current snapshot
  listener(getState())
  return () => listeners.delete(listener)
}

// PUBLIC_INTERFACE
export function getState() {
  /** Get a shallow copy of the current state to avoid mutations outside store */
  return {
    notes: [...state.notes],
    selectedId: state.selectedId,
    search: state.search,
    sort: state.sort,
    editing: state.editing,
  }
}

// PUBLIC_INTERFACE
export function setSearch(query) {
  /** Set search query */
  state.search = String(query || '')
  notify()
}

// PUBLIC_INTERFACE
export function selectNote(id) {
  /** Select note by id */
  state.selectedId = id
  state.editing = false
  notify()
}

// PUBLIC_INTERFACE
export function startEditing() {
  /** Enter editing mode */
  state.editing = true
  notify()
}

// PUBLIC_INTERFACE
export function cancelEditing() {
  /** Exit editing mode without saving */
  state.editing = false
  notify()
}

// PUBLIC_INTERFACE
export function createNote() {
  /** Create a new empty note and start editing */
  const now = Date.now()
  const note = {
    id: crypto?.randomUUID ? crypto.randomUUID() : String(now),
    title: 'Untitled',
    content: '',
    createdAt: now,
    updatedAt: now,
  }
  state.notes.unshift(note)
  state.selectedId = note.id
  state.editing = true
  persist()
  notify()
}

// PUBLIC_INTERFACE
export function updateSelectedNote({ title, content }) {
  /** Update the selected note with new title/content */
  const idx = state.notes.findIndex((n) => n.id === state.selectedId)
  if (idx === -1) return
  const now = Date.now()
  const existing = state.notes[idx]
  const updated = {
    ...existing,
    title: title != null ? title : existing.title,
    content: content != null ? content : existing.content,
    updatedAt: now,
  }
  state.notes.splice(idx, 1)
  // Keep notes sorted by updatedAt desc
  state.notes.unshift(updated)
  state.selectedId = updated.id
  state.editing = false
  persist()
  notify()
}

// PUBLIC_INTERFACE
export function deleteSelectedNote() {
  /** Delete the currently selected note and select next available */
  if (!state.selectedId) return
  const idx = state.notes.findIndex((n) => n.id === state.selectedId)
  if (idx === -1) return
  state.notes.splice(idx, 1)
  state.selectedId = state.notes[0]?.id || null
  state.editing = false
  persist()
  notify()
}
