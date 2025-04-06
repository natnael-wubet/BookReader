import { useState,useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Store,load } from '@tauri-apps/plugin-store';
import "./App.css";

interface StoredValue {
  value: number;
}

function App() {
  const [value, setValue] = useState<number>(5);
  const [storedValue, setStoredValue] = useState<StoredValue | null>(null);


  useEffect(() => {
    async function initStore() {
      try {
        // Correctly load the store using static method
        const store = await Store.load('store.json', { autoSave: true });
        
        // Load existing value
        const saved = await store.get<StoredValue>('some-key');
        if (saved) {
          setStoredValue(saved);
          setValue(saved.value); // Sync input with stored value
        }
      } catch (error) {
        console.error('Store init error:', error);
      }
    }
    
    initStore();
  }, []);

  async function saveValue() {
    try {
      // Correctly load the store using static method
      const store = await Store.load('store.json');
      await store.set('some-key', { value });
      await store.save();
      setStoredValue({ value });
    } catch (error) {
      console.error('Save error:', error);
    }
  }
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">

    <div>
      <h1>Store Example</h1>
      
      <input 
        type="number" 
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      
      <button onClick={saveValue}>Save</button>

      {storedValue ? (
        <p>Stored Value: {storedValue.value}</p>
      ):"none"}
    </div>
    </main>
  );
}

export default App;
