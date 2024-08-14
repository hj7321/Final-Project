import { create, StoreApi, UseBoundStore } from 'zustand';

interface SidebarState {
  // 햄버거 아이콘 클릭 후 나오는 사이드바
  isSidebarOpened: boolean;
  sidebarOpen: () => void;
  sidebarClose: () => void;
  // 코듀 앱 정보 클릭 후 나오는 사이드바
  isAppInfoSidebarOpened: boolean;
  appInfoSidebarOpen: () => void;
  appInfoSidebarClose: () => void;
  // 검색 아이콘 클릭 후 나오는 검색바
  isSearchBarOpened: boolean;
  searchBarOpen: () => void;
  searchBarClose: () => void;
}

const useSidebarStore: UseBoundStore<StoreApi<SidebarState>> = create<SidebarState>((set) => ({
  isSidebarOpened: false,
  sidebarOpen: () => set({ isSidebarOpened: true }),
  sidebarClose: () => set({ isSidebarOpened: false }),
  isAppInfoSidebarOpened: false,
  appInfoSidebarOpen: () => set({ isAppInfoSidebarOpened: true }),
  appInfoSidebarClose: () => set({ isAppInfoSidebarOpened: false }),
  isSearchBarOpened: false,
  searchBarOpen: () => set({ isSearchBarOpened: true }),
  searchBarClose: () => set({ isSearchBarOpened: false })
}));

export default useSidebarStore;
