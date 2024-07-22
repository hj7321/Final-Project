import { create } from 'zustand';

export default function useLoginStore() {
  create((set) => ({
    isLogin: false
  }));
}
