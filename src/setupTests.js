import '@testing-library/jest-dom'

// Node 22+ ships a global `localStorage` that, without a valid --localstorage-file,
// resolves to a non-functional stub and shadows jsdom's own implementation.
// Replace it with a simple in-memory Storage so storage-backed tests work.
class MemoryStorage {
  #store = new Map()
  get length() {
    return this.#store.size
  }
  clear() {
    this.#store.clear()
  }
  getItem(key) {
    return this.#store.has(key) ? this.#store.get(key) : null
  }
  setItem(key, value) {
    this.#store.set(key, String(value))
  }
  removeItem(key) {
    this.#store.delete(key)
  }
  key(index) {
    return Array.from(this.#store.keys())[index] ?? null
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
})


