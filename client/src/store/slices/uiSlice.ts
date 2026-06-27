import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PageSize } from '@/constants';
import { DEFAULT_PAGE_SIZE } from '@/constants';

type Theme = 'light' | 'dark' | 'system';

interface UISliceState {
  sidebarCollapsed: boolean;
  theme: Theme;
  pageSize: PageSize;
  commandPaletteOpen: boolean;
}

const initialState: UISliceState = {
  sidebarCollapsed: false,
  theme: (localStorage.getItem('creators-mela-theme') as Theme) || 'light',
  pageSize: DEFAULT_PAGE_SIZE,
  commandPaletteOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('creators-mela-theme', action.payload);
    },
    setPageSize: (state, action: PayloadAction<PageSize>) => {
      state.pageSize = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.commandPaletteOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  setPageSize,
  toggleCommandPalette,
  setCommandPaletteOpen,
} = uiSlice.actions;

export default uiSlice;
