import Blits from '@lightningjs/blits'
import { theme, radius, elevation } from '../styles/theme.js'

export default Blits.Component('NotesList', {
  props: ['notes', 'selectedId', 'onSelect'],
  template: `
    <Element w="560" h="980" :color="$surface" :effects="[$shader('radius', {radius: ${radius.lg}}), $shader('boxshadow', ${JSON.stringify(
      elevation.md
    )})]">
      <Element x="0" y="0" w="560" h="980">
        <Element :y="16">
          <Text x="24" y="0" size="22" :color="$muted" content="Notes" />
        </Element>
        <Element :y="48">
          <Element :y.for="note,idx in $list" :x="0" :w="560" :h="104" :color="idx % 2 ? $rowOdd : $rowEven" :effects="[$shader('radius',{radius:${radius.sm}})]">
            <Element :x="0" :y="idx*104">
              <Element w="560" h="104" :color="note.id === $selectedId ? $selectedBg : 'transparent'" />
              <Text x="24" y="16" size="24" :color="$text" :content="note.title || 'Untitled'" />
              <Text x="24" y="54" size="18" :color="$muted" :content="note.preview" />
              <Text x="24" y="78" size="16" :color="$muted" :content="note.time" />
            </Element>
          </Element>
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
    }
  },
  watch: {
    notes(v) {
      this.list = (v || []).map((n) => ({
        id: n.id,
        title: n.title,
        preview:
          (n.content || '').slice(0, 60).replace(/\n/g, ' ') +
          ((n.content || '').length > 60 ? '…' : ''),
        time: `Updated ${new Date(n.updatedAt).toLocaleString()}`,
      }))
    },
    selectedId(v) {
      this.selectedId = v
    },
  },
  hooks: {
    ready() {
      this.list = (this.notes || []).map((n) => ({
        id: n.id,
        title: n.title,
        preview:
          (n.content || '').slice(0, 60).replace(/\n/g, ' ') +
          ((n.content || '').length > 60 ? '…' : ''),
        time: `Updated ${new Date(n.updatedAt).toLocaleString()}`,
      }))
    },
  },
  events: {
    click: {
      handler({ y }) {
        // Determine clicked row by y coordinate (row height ~104, after header ~48)
        const offsetY = y - 48
        const idx = Math.floor(offsetY / 104)
        const item = this.list[idx]
        if (item) {
          this.onSelect && this.onSelect(item.id)
        }
      },
    },
  },
})
