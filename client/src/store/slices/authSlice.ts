import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '@/types';
import { api } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

function safeSetUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem('cm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cm_user');
    }
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}

function safeGetUser(): User | null {
  try {
    const stored = localStorage.getItem('cm_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const savedUser = safeGetUser();

const initialState: AuthState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
  isLoading: true,
  error: null,
};

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data;
  } catch (error) {
    return rejectWithValue('Not authenticated');
  }
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
        safeSetUser(state.user);
      }
    },
    updateUser: (state, action) => {
      if (state.user) {
        Object.assign(state.user, action.payload);
        safeSetUser(state.user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        const prev = state.user;
        const next = action.payload;
        if (next) {
          if (prev?.avatar && !next.avatar) {
            next.avatar = prev.avatar;
          }
          state.user = next;
          state.isAuthenticated = true;
          safeSetUser(next);
        }
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        safeSetUser(state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        safeSetUser(null);
      });
  },
});

export const { clearError, updateAvatar, updateUser } = authSlice.actions;
export default authSlice;
