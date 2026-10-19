const safeStorage = {
  read: (key) => {
    try {
      const v = localStorage.getItem(key);
      if (!v) return null;
      try { return JSON.parse(v); } catch { return v; }
    } catch { return null; }
  },
  write: (key, value) => {
    try {
      const v = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, v);
      return true;
    } catch {
      try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
      return false;
    }
  },
  remove: (key) => {
    try { localStorage.removeItem(key); } catch {}
  }
};

export default safeStorage;
