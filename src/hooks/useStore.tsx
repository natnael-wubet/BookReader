
import { Store } from '@tauri-apps/plugin-store';
import { useEffect, useState } from 'react';

type StoreOptions = {
  autoSave?: boolean | number;
};

export function useStore<T = unknown>(
  path: string,
  options?: StoreOptions
) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initStore = async () => {
      const store = await Store.load(path, options);
      setStore(store);
      setLoading(false);
    };
    initStore();
  }, [path]);

  const set = async (key: string, value: T) => {
    if (!store) return;
    await store.set(key, value);
  };

  const get = async (key: string): Promise<T | null> => {
    if (!store) return null;
    return (await store.get<T>(key)) ?? null;
  };

  return { store, loading, set, get };
}
