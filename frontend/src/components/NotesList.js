import Blits from '@lightningjs/blits'
import { theme, radius, elevation } from '../styles/theme.js'

export default Blits.Component('NotesList', {
  props: ['notes', 'selectedId', 'onSelect'],
  template: `
    <Element w="560" h="980" :color="$surface" :effects="$listContainerEffects">
      <Element x="0" y="0" w="560" h="980">
        <Element :y="16">
          <Text x="24" y="0" size="22" :color="$muted" content="Notes" />
        </Element>

        <Element :y="48">
          <!-- Inject pre-rendered markup for rows to avoid :for parser issues -->
          <Slot :content="$rowsMarkup" />
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      surface: theme.surface,
      text: theme.text,
      muted: '#6b7280',
      rowOdd: '#ffffff',
      rowEven: '#f3f4f6',
      selectedBg: '#dbeafe', // light primary
      list: [],
      selectedId: this.selectedId,
      rowsMarkup: '',
      // Precomputed effects to avoid inline complex template expressions
      listContainerEffects: [
        this.$shader('radius', { radius: radius.lg }),
        this.$shader('boxshadow', elevation.md),
      ],
      rowRadiusEffect: [this.$shader('radius', { radius: radius.sm })],
    }
  },
  methods: {
    // PUBLIC_INTERFACE
    buildListFromNotes(src) {
      /** Normalize notes for internal rendering. */
      return (Array.isArray(src) ? src : []).map((n) => ({
        id: n.id,
        title: n.title || 'Untitled',
        content: n.content || '',
        updatedAt: n.updatedAt || Date.now(),
      }))
    },
    // PUBLIC_INTERFACE
    buildRowsMarkup() {
      /** Build the markup string for all rows. */
      const rows = this.list.map((n, idx) => {
        const y = idx * 104
        const rowColor = idx % 2 ? this.rowOdd : this.rowEven
        const isSelected = n.id === this.selectedId
        const preview =
          (n.content || '').slice(0, 60).replace(/\n/g, ' ') +
          ((n.content || '').length > 60 ? '\u2026' : '')
        const time = `Updated ${new Date(n.updatedAt).toLocaleString()}`
        // effects attribute references a state variable with a single radius effect
        return `
          <Element x="0" y="${y}" w="560" h="104" color="${rowColor}" :effects="$rowRadiusEffect">
            <Element w="560" h="104" color="${isSelected ? this.selectedBg : 'transparent'}" />
            <Text x="24" y="16" size="24" :color="$text" content="${this.escapeAttr(
              n.title || 'Untitled'
            )}" />
            <Text x="24" y="54" size="18" :color="$muted" content="${this.escapeAttr(preview)}" />
            <Text x="24" y="78" size="16" :color="$muted" content="${this.escapeAttr(time)}" />
          </Element>
        `
      })
      this.rowsMarkup = rows.join('\n')
    },
    // PUBLIC_INTERFACE
    escapeAttr(val) {
      /** Escape attribute text for safe inline insertion. */
      return String(val)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    },
  },
  watch: {
    notes(v) {
      this.list = this.buildListFromNotes(v)
      this.buildRowsMarkup()
    },
    selectedId(v) {
      this.selectedId = v
      this.buildRowsMarkup()
    },
  },
  hooks: {
    ready() {
      this.list = this.buildListFromNotes(this.notes)
      this.buildRowsMarkup()
    },
  },
  events: {
    click: {
      handler({ y }) {
        // Determine clicked row by y coordinate (row height ~104, after header area y-offset 48)
        const offsetY = Math.max(0, y - 48)
        const idx = Math.floor(offsetY / 104)
        const item = this.list[idx]
        if (item) {
          this.onSelect && this.onSelect(item.id)
        }
      },
    },
  },
})
