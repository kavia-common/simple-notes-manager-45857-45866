import Blits from '@lightningjs/blits'
import { theme, radius, elevation } from '../styles/theme.js'

export default Blits.Component('NoteEditor', {
  props: ['note', 'editing', 'onEdit', 'onSave', 'onCancel', 'onDelete'],
  template: `
    <Element w="1300" h="980" x="600" :color="$surface" :effects="$editorEffects">
      <Element x="24" y="24" w="1252" h="80">
        <Text size="26" :color="$muted" content="Title" />
        <Text y="36" size="32" :color="$text" :content="$titleDisplay" />
      </Element>

      <Element x="24" y="124" w="1252" h="700">
        <Text size="26" :color="$muted" content="Content" />
        <Text y="36" size="24" :color="$text" :content="$contentDisplay" />
      </Element>

      <Element x="24" y="860" w="1252" h="96">
        <Element w="180" h="56" :color="$editColor" :effects="$btnRadiusEffect">
          <Text x="90" y="14" :mount="{x: $mountX}" size="24" color="#fff" :content="$editText" />
        </Element>
        <Element x="200" w="180" h="56" :color="$saveColor" :alpha="$saveAlpha" :effects="$btnRadiusEffect">
          <Text x="90" y="14" :mount="{x: $mountX}" size="24" color="#fff" content="Save" />
        </Element>
        <Element x="400" w="180" h="56" :color="$cancelColor" :alpha="$cancelAlpha" :effects="$btnRadiusEffect">
          <Text x="90" y="14" :mount="{x: $mountX}" size="24" color="#fff" content="Cancel" />
        </Element>
        <Element :x="1252 - 180" w="180" h="56" :color="$deleteColor" :effects="$btnRadiusEffect">
          <Text x="90" y="14" :mount="{x: $mountX}" size="24" color="#fff" content="Delete" />
        </Element>
      </Element>
    </Element>
  `,
  state() {
    const n = this.note || {}
    return {
      surface: theme.surface,
      text: theme.text,
      muted: '#6b7280',
      editing: !!this.editing,
      title: n.title || '',
      content: n.content || '',
      titleDisplay: n.title || '',
      contentDisplay: n.content || '',
      editText: this.editing ? 'Editing' : 'Edit',
      editColor: theme.primary,
      saveColor: theme.secondary,
      saveAlpha: this.editing ? 1 : 0.4,
      cancelColor: '#6b7280',
      cancelAlpha: this.editing ? 1 : 0.4,
      deleteColor: theme.error,
      // Precomputed effects and mounts
      editorEffects: [
        this.$shader('radius', { radius: radius.lg }),
        this.$shader('boxshadow', elevation.md),
      ],
      btnRadiusEffect: [this.$shader('radius', { radius: radius.md })],
      mountX: 0.5,
    }
  },
  watch: {
    note(n) {
      const note = n || {}
      this.title = note.title || ''
      this.content = note.content || ''
      this.titleDisplay = this.title
      this.contentDisplay = this.content
    },
    editing(v) {
      this.editing = !!v
      this.editText = v ? 'Editing' : 'Edit'
      this.saveAlpha = v ? 1 : 0.4
      this.cancelAlpha = v ? 1 : 0.4
    },
  },
  input: {
    // Simplified typing for demonstration: update title/content when editing
    char(key) {
      if (!this.editing) return
      // route to content by default
      this.content += key
      this.contentDisplay = this.content
    },
    backspace() {
      if (!this.editing) return
      this.content = (this.content || '').slice(0, -1)
      this.contentDisplay = this.content
    },
    enter() {
      // default enter triggers edit toggle
      if (!this.editing) {
        this.onEdit && this.onEdit()
      }
    },
    // Basic keyboard shortcuts
    ctrl_n() {
      // handled by scene, not here
    },
    ctrl_s() {
      if (this.editing) {
        this.onSave && this.onSave({ title: this.title, content: this.content })
      }
    },
    cmd_s() {
      if (this.editing) {
        this.onSave && this.onSave({ title: this.title, content: this.content })
      }
    },
  },
  events: {
    click: {
      handler({ x, y }) {
        // Buttons: Edit (0..180), Save (200..380), Cancel (400..580), Delete (end-180..end)
        if (y >= 860 && y <= 916) {
          if (x >= 24 && x < 204) {
            // Edit
            this.onEdit && this.onEdit()
            return
          }
          if (x >= 224 && x < 404 && this.editing) {
            // Save
            this.onSave && this.onSave({ title: this.title, content: this.content })
            return
          }
          if (x >= 424 && x < 604 && this.editing) {
            // Cancel
            this.onCancel && this.onCancel()
            return
          }
          if (x >= 24 + 1252 - 180 && x <= 24 + 1252) {
            // Delete with simple confirmation
            const ok = confirm?.('Delete this note?') ?? true
            if (ok) {
              this.onDelete && this.onDelete()
            }
          }
        }
      },
    },
  },
})
