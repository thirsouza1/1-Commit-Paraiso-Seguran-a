import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AppState {
  user: User | null;
  profile: any | null;
  isCinematicFinished: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setCinematicFinished: (finished: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  profile: null,
  isCinematicFinished: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setCinematicFinished: (finished) => set({ isCinematicFinished: finished }),
}));
