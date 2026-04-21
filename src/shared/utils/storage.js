export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.log(`storage.setItem failed for key "${key}":`, err)
  }
}

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch (err) {
    console.log(`storage.getItem failed for key "${key}":`, err)
    return fallback
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.log(`storage.removeItem failed for key "${key}":`, err)
  }
}

export function clear() {
  try {
    localStorage.clear()
  } catch (err) {
    console.log('storage.clear failed:', err)
  }
}
