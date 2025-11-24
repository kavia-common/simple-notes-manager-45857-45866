const STORAGE_KEY = 'notes-app-data'

/**
 * Safe JSON parse.
 * @param {string} txt
 * @returns {any}
 */
function safeParse(txt) {
  try {
    return JSON.parse(txt)
  } catch {
    return null
  }
}

/**
 * Load data from localStorage.
 * @returns {{notes: any[]}|null}
 */
export function loadFromStorage() {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  const data = safeParse(raw)
  if (!data || !Array.isArray(data.notes)) return null
  return data
}

/**
 * Save data to localStorage.
 * @param {{notes: any[]}} data
 */
export function saveToStorage(data) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore write failures
  }
}
