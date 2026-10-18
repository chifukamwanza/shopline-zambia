const safeStorage = {
  read: (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },

  write: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore storage errors in restricted browsers
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore storage errors in restricted browsers
    }
  }
}

export default safeStorage
