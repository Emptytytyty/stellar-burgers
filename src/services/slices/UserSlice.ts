import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { access, stat } from 'fs';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserError: null | string;
  loginUserRequest: boolean;
  logoutUserRequest: boolean;
  logoutUserError: null | string;
  updateUserRequest: boolean;
  updateUserError: null | string;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: true,
  isAuthenticated: false,
  loginUserError: null,
  loginUserRequest: false,
  logoutUserRequest: false,
  logoutUserError: null,
  updateUserRequest: false,
  updateUserError: null
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user: TLoginData) => {
    const res = await loginUserApi(user);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user: TRegisterData) => {
    const res = await registerUserApi(user);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res;
  }
);

export const updateUserData = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const getUserData = createAsyncThunk('user/getUser', async () =>
  getUserApi()
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  logoutApi().then((data) => {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    return data;
  });
});

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getIsAuthenticated: (state: TUserState) => state.isAuthenticated,
    getIsLoginUserRequest: (state: TUserState) => state.loginUserRequest,
    getIsAuthChecked: (state: TUserState) => state.isAuthChecked,
    getUser: (state: TUserState) => state.user,
    getIsLogoutUserRequest: (state: TUserState) => state.logoutUserRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state: TUserState) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state: TUserState, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.loginUserError = action.payload as string;
      })
      .addCase(loginUser.fulfilled, (state: TUserState, action) => {
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.pending, (state: TUserState) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(registerUser.rejected, (state: TUserState, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.loginUserError = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.fulfilled, (state: TUserState, action) => {
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(getUserData.pending, (state: TUserState) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(getUserData.rejected, (state: TUserState, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.loginUserError = action.payload as string;
      })
      .addCase(getUserData.fulfilled, (state: TUserState, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state: TUserState) => {
        state.logoutUserRequest = true;
        state.logoutUserError = null;
      })
      .addCase(logoutUser.rejected, (state: TUserState, action) => {
        state.logoutUserRequest = false;
        state.logoutUserError = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state: TUserState, action) => {
        state.user = null;
        state.logoutUserRequest = false;
        state.isAuthenticated = false;
      })
      .addCase(updateUserData.pending, (state: TUserState) => {
        state.updateUserRequest = true;
        state.updateUserError = null;
      })
      .addCase(updateUserData.rejected, (state: TUserState, action) => {
        state.updateUserRequest = false;
        state.updateUserError = action.payload as string;
      })
      .addCase(updateUserData.fulfilled, (state: TUserState, action) => {
        state.updateUserRequest = false;
        state.user = action.payload.user;
      });
  }
});

export const {
  getIsAuthenticated,
  getIsLoginUserRequest,
  getIsAuthChecked,
  getUser
} = UserSlice.selectors;
