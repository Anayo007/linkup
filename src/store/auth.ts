'use client';

import { create } from 'zustand';
import { User, Profile } from '@/types';

interface AuthState {
  user: (User & { profile?: Profile }) | null;
  isLoading: boolean;
  setUser: (user: (User & { profile?: Profile }) | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}));
