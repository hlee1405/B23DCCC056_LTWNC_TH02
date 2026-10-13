import { create } from 'zustand';

export interface PinState {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
}

export const usePinStore = create<PinState>((set, get) => ({
  pinnedIds: [],
  togglePin: (id: string) => {
    set((state) => {
      const isAlreadyPinned = state.pinnedIds.includes(id);
      return {
        pinnedIds: isAlreadyPinned
          ? state.pinnedIds.filter((item) => item !== id)
          : [id, ...state.pinnedIds],
      };
    });
  },
  isPinned: (id: string) => get().pinnedIds.includes(id),
}));
