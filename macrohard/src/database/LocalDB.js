import { useEffect, useState } from "react";

class Database {
  STORAGE_KEY = "data_storage";
  data = [];
  listeners = [];
  static instance;

  constructor() {
    this.loadFromStorage();
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.data = parsed.data_storage || [];
      } catch (e) {
        this.data = [];
      }
    }
  }

  persist() {
    const wrapper = { [this.STORAGE_KEY]: this.data };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wrapper));
  }

  add(value) {
    this.data.push(value);
    this.persist();
    this.notify();
  }

  remove(value) {
    this.data = this.data.filter((item) => item !== value);
    this.persist();
    this.notify();
  }

  getAll() {
    return this.data;
  }
  notify() {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  clear() {
    this.data = [];
    localStorage.removeItem(this.STORAGE_KEY);
    this.notify();
  }
}

// Usage:
const database = Database.getInstance();

export function useDatabase() {
  const [data, setData] = useState(database.getAll());

  useEffect(() => {
    const unsubscribe = database.subscribe(() => {
      setData([...database.getAll()]);
    });

    return unsubscribe;
  }, []);

  return {
    data,
    addItem: database.add.bind(database),
    removeItem: database.remove.bind(database),
    clearAll: database.clear.bind(database),
  };
}
