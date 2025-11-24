import Blits from '@lightningjs/blits'
import { theme } from '../styles/theme.js'

export default Blits.Component('Header', {
  props: ['onNew'],
  template: `
    <Element w="1920" h="88" :color="$surface">
      <Element x="32" y="22">
        <Text size="36" :color="$text" content="Simple Notes" />
      </Element>
      <Element :x="1696" y="16" w="200" h="56" :color="$primary">
        <Text x="100" y="14" mount="{x:0.5}" size="24" color="#ffffff" content="+ New Note"/>
      </Element>
    </Element>
  `,
  state() {
    return {
      primary: theme.primary,
      surface: theme.surface,
      text: theme.text,
      // Radius removed from effects to avoid precompiler issues
    }
  },
  input: {
    enter() {
      this.onNew && this.onNew()
    },
  },
  events: {
    click: {
      handler() {
        this.onNew && this.onNew()
      },
    },
  },
})
