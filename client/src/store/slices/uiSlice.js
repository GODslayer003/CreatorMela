import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const initialState = {
  sidebarCollapsed: false,
  theme: localStorage.getItem('creators-mela-theme') || 'light',
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
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('creators-mela-theme', action.payload);
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },
    setCommandPaletteOpen: (state, action) => {
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
