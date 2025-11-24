# lightningjs

### Simple Notes (LightningJS + Blits)

A minimal notes app with local persistence and the Ocean Professional theme.

Features:
- Create, view, edit, and delete notes
- Search and filter by title/content
- Sort by last updated (desc)
- Local persistence via localStorage (key: `notes-app-data`)
- Keyboard shortcuts: 
  - Ctrl/Cmd + N: New note
  - Ctrl/Cmd + S: Save (when editing)

Theme:
- Ocean Professional colors: primary #2563EB, secondary #F59E0B, success #F59E0B, error #EF4444, background #f9fafb, surface #ffffff, text #111827
- Rounded corners, subtle shadows, smooth transitions

Run locally:
```sh
cd frontend
npm install
npm run dev
# open the provided URL (port 3000)
```

Notes:
- Data is kept in memory and synced to localStorage.
- No backend is required; VITE_* envs are unused but can be integrated later.

### Resources

- [Blits documentation](https://lightningjs.io/v3-docs/blits/getting_started/intro.html) - official documentation
- [Blits Example App](https://blits-demo.lightningjs.io/?source=true) - a great reference to learn by example
- [Blits Components](https://lightningjs.io/blits-components.html) - off-the-shelf, basic and performant reference components
