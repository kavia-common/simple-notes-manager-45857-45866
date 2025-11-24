import Blits from '@lightningjs/blits'
import Header from '../components/Header.js'
import SearchBar from '../components/SearchBar.js'
import NotesList from '../components/NotesList.js'
import NoteEditor from '../components/NoteEditor.js'
import {
  subscribe,
  getState,
  setSearch,
  selectNote,
  startEditing,
  cancelEditing,
  createNote,
  updateSelectedNote,
  deleteSelectedNote,
} from '../store/notesStore.js'
import { theme } from '../styles/theme.js'

export default Blits.Component('Notes', {
  components: { Header, SearchBar, NotesList, NoteEditor },
  template: `
    <Element w="1920" h="1080" :color="$background">
      <Header :onNew="$onNew" />
      <Element x="24" y="112" w="560" h="48">
        <SearchBar :value="$search" :onChange="$onSearch" />
      </Element>
      <Element x="24" y="168">
        <NotesList :notes="$filtered" :selectedId="$selectedId" :onSelect="$onSelect" />
      </Element>
      <Element x="0" y="88">
        <NoteEditor :note="$selectedNote" :editing="$editing" :onEdit="$onEdit" :onSave="$onSave" :onCancel="$onCancel" :onDelete="$onDelete" />
      </Element>
    </Element>
  `,
  state() {
    const s = getState()
    return {
      background: theme.background,
      search: s.search,
      selectedId: s.selectedId,
      notes: s.notes,
      filtered: this.filterNotes(s.notes, s.search),
      editing: s.editing,
      selectedNote: s.notes.find((n) => n.id === s.selectedId) || null,
      unsub: null,
    }
  },
  methods: {
    filterNotes(list, query) {
      const q = (query || '').toLowerCase().trim()
      const sorted = [...(list || [])].sort((a, b) => b.updatedAt - a.updatedAt)
      if (!q) return sorted
      return sorted.filter(
        (n) =>
          (n.title || '').toLowerCase().includes(q) ||
          (n.content || '').toLowerCase().includes(q)
      )
    },
    // callbacks
    onNew() {
      createNote()
    },
    onSearch(v) {
      setSearch(v)
    },
    onSelect(id) {
      selectNote(id)
    },
    onEdit() {
      startEditing()
    },
    onSave(payload) {
      updateSelectedNote(payload)
    },
    onCancel() {
      cancelEditing()
    },
    onDelete() {
      deleteSelectedNote()
    },
    // Keyboard shortcuts
    handleKeydown(e) {
      const key = e?.key?.toLowerCase()
      if (!key) return
      const meta = e.metaKey || e.ctrlKey
      if (meta && key === 'n') {
        e.preventDefault?.()
        createNote()
      }
      if (meta && key === 's') {
        e.preventDefault?.()
        const s = getState()
        if (s.editing) {
          // Save current selected note by mirroring what editor holds:
          // The editor updates via component state; here we trigger save with current selected note as is.
          // Since we don't have the draft here, rely on editor's own ctrl/cmd+s.
        }
      }
    },
  },
  hooks: {
    ready() {
      this.unsub = subscribe((s) => {
        this.search = s.search
        this.selectedId = s.selectedId
        this.notes = s.notes
        this.filtered = this.filterNotes(s.notes, s.search)
        this.editing = s.editing
        this.selectedNote = s.notes.find((n) => n.id === s.selectedId) || null
      })
      // Keyboard shortcuts at document level if available
      if (typeof window !== 'undefined') {
        this._keydown = (ev) => this.handleKeydown(ev)
        window.addEventListener('keydown', this._keydown)
      }
    },
    destroy() {
      this.unsub && this.unsub()
      if (typeof window !== 'undefined' && this._keydown) {
        window.removeEventListener('keydown', this._keydown)
      }
    },
  },
})
