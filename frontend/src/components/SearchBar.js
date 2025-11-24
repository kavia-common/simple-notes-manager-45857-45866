import Blits from '@lightningjs/blits'
import { theme } from '../styles/theme.js'

export default Blits.Component('SearchBar', {
  props: ['value', 'onChange'],
  template: `
    <Element w="100%" h="48" :color="$surface">
      <Text x="16" y="10" size="24" :color="$placeholder" :content="$placeholderContent" />
      <Text x="16" y="10" size="24" :color="$text" :content="$value" />
    </Element>
  `,
  state() {
    return {
      surface: theme.surface,
      text: theme.text,
      placeholder: '#6b7280',
      placeholderText: 'Search notes...',
      value: this.value || '',
    }
  },
  computed: {
    placeholderContent() {
      // show placeholder only when value is empty
      return this.value ? '' : this.placeholderText
    },
  },
  watch: {
    value(v) {
      this.value = v || ''
    },
  },
  input: {
    char(key) {
      const next = (this.value || '') + key
      this.value = next
      this.onChange && this.onChange(next)
    },
    backspace() {
      const next = (this.value || '').slice(0, -1)
      this.value = next
      this.onChange && this.onChange(next)
    },
    clear() {
      this.value = ''
      this.onChange && this.onChange('')
    },
  },
})
