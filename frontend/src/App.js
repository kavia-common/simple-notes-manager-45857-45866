import Blits from '@lightningjs/blits'
import Notes from './pages/Notes.js'

export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>
  `,
  routes: [{ path: '/', component: Notes }],
})
