import { create, StoreApi, UseBoundStore } from 'zustand';

interface IndexState {
  selectedIdx: number | null;
  setSelectedIdx: (selectedIdx: number | null) => void;
}

const useIndexStore: UseBoundStore<StoreApi<IndexState>> = create<IndexState>((set) => ({
  selectedIdx: null,
  setSelectedIdx: (selectedIdx) => set({ selectedIdx })
}));

export default useIndexStore;
