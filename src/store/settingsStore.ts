import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = '@chefy_settings';

interface SettingsState {
  isVegetarian: boolean;
  isHalal: boolean;
  darkMode: boolean;
  hydrated: boolean;
  setVegetarian: (value: boolean) => Promise<void>;
  setHalal: (value: boolean) => Promise<void>;
  setDarkMode: (value: boolean) => Promise<void>;
  loadSettings: () => Promise<void>;
}

const useSettingsStore = create<SettingsState>((set, get) => ({
  isVegetarian: false,
  isHalal: false,
  darkMode: false,
  hydrated: false,

  setVegetarian: async (value) => {
    set({ isVegetarian: value });
    await _persist(get());
  },

  setHalal: async (value) => {
    set({ isHalal: value });
    await _persist(get());
  },

  setDarkMode: async (value) => {
    set({ darkMode: value });
    await _persist(get());
  },

  loadSettings: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: Partial<SettingsState> = JSON.parse(raw);
        set({
          isVegetarian: saved.isVegetarian ?? false,
          isHalal: saved.isHalal ?? false,
          darkMode: saved.darkMode ?? false,
        });
      }
    } catch (e) {
      console.warn('[Settings] Failed to load:', e);
    } finally {
      set({ hydrated: true });
    }
  },
}));

async function _persist(state: SettingsState) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isVegetarian: state.isVegetarian,
        isHalal: state.isHalal,
        darkMode: state.darkMode,
      }),
    );
  } catch (e) {
    console.warn('[Settings] Failed to save:', e);
  }
}

export default useSettingsStore;
