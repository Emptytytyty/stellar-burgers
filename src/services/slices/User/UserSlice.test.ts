import { describe, jest, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  getUserData,
  loginUser,
  logoutUser,
  registerUser,
  updateUserData,
  UserSlice
} from './UserSlice';

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  getUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../../utils/cookie';

const mockedUser = {
  email: 'Evgeniy@mail.ru',
  name: 'Evgeniy'
};

const mockedUserWithPassword = {
  ...mockedUser,
  password: 'qwerty123'
};

const mockedUserResponse = {
  user: mockedUser,
  accessToken: 'testAccessToken',
  refreshToken: 'testRefreshToken'
};

describe('Слайс юзера', () => {
  const preloadedState = {
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
  let store = configureStore({
    reducer: UserSlice.reducer
  });
  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: UserSlice.reducer,
      preloadedState
    });
    global.localStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
      removeItem: jest.fn(() => null)
    } as unknown as Storage;
  });
  describe('Логин юзера', () => {
    test('Проверка обработки запроса', async () => {
      (loginUserApi as jest.Mock<() => Promise<any>>).mockResolvedValue({});

      store.dispatch(
        loginUser({ email: 'Evgeniy@mail.ru', password: 'qwerty123' })
      );
      expect(store.getState().loginUserRequest).toBe(true);
    });
    test('Проверка успешного выполнения запроса', async () => {
      (loginUserApi as jest.Mock<() => Promise<any>>).mockResolvedValue(
        mockedUserResponse
      );

      await store.dispatch(
        loginUser({ email: 'Evgeniy@mail.ru', password: 'qwerty123' })
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        'testRefreshToken'
      );
      expect(setCookie).toHaveBeenCalledWith('accessToken', 'testAccessToken');
      expect(store.getState().loginUserRequest).toBe(false);
      expect(store.getState().isAuthChecked).toBe(true);
      expect(store.getState().isAuthenticated).toBe(true);
      expect(store.getState().user).toEqual(mockedUser);
    });
    test('Проверка ошибки при обработке запроса', async () => {
      (loginUserApi as jest.Mock<() => Promise<any>>).mockRejectedValue(
        'ошибка'
      );

      await store.dispatch(
        loginUser({
          email: mockedUserWithPassword.email,
          password: mockedUserWithPassword.password
        })
      );

      expect(store.getState().loginUserRequest).toBe(false);
      expect(store.getState().isAuthChecked).toBe(true);
      expect(store.getState().isAuthenticated).toBe(false);
      expect(store.getState().loginUserError).toBe('ошибка');
    });
  });
  describe('Регистрация юзера', () => {
    test('Проверка обработки запроса', async () => {
      (registerUserApi as jest.Mock<() => Promise<any>>).mockResolvedValue({});

      store.dispatch(registerUser(mockedUserWithPassword));
      expect(store.getState().loginUserRequest).toBe(true);
    });
    test('Проверка успешного выполнения запроса', async () => {
      (registerUserApi as jest.Mock<() => Promise<any>>).mockResolvedValue(
        mockedUserResponse
      );

      await store.dispatch(registerUser(mockedUserWithPassword));
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        'testRefreshToken'
      );
      expect(setCookie).toHaveBeenCalledWith('accessToken', 'testAccessToken');
      expect(store.getState().loginUserRequest).toBe(false);
      expect(store.getState().isAuthChecked).toBe(true);
      expect(store.getState().isAuthenticated).toBe(true);
      expect(store.getState().user).toEqual(mockedUser);
    });
    test('Проверка ошибки при обработке запроса', async () => {
      (registerUserApi as jest.Mock<() => Promise<any>>).mockRejectedValue(
        'ошибка'
      );

      await store.dispatch(registerUser(mockedUserWithPassword));

      expect(store.getState().loginUserRequest).toBe(false);
      expect(store.getState().isAuthChecked).toBe(true);
      expect(store.getState().isAuthenticated).toBe(false);
      expect(store.getState().loginUserError).toBe('ошибка');
    });
  });
  describe('Обновление данных юзера', () => {
    test('Проверка обработки запроса', async () => {
      (updateUserApi as jest.Mock<() => Promise<any>>).mockResolvedValue({});

      store.dispatch(updateUserData(mockedUserWithPassword));
      expect(store.getState().updateUserRequest).toBe(true);
    });
    test('Проверка успешного выполнения запроса', async () => {
      (updateUserApi as jest.Mock<() => Promise<any>>).mockResolvedValue({
        user: mockedUser
      });

      await store.dispatch(updateUserData(mockedUserWithPassword));
      expect(store.getState().updateUserRequest).toBe(false);
      expect(store.getState().user).toEqual(mockedUser);
    });
    test('Проверка ошибки при обработке запроса', async () => {
      (updateUserApi as jest.Mock<() => Promise<any>>).mockRejectedValue(
        'ошибка'
      );

      await store.dispatch(updateUserData(mockedUserWithPassword));
      expect(store.getState().updateUserRequest).toBe(false);
      expect(store.getState().updateUserError).toBe('ошибка');
    });
    describe('Получение данных юзера', () => {
      test('Проверка обработки запроса', async () => {
        (getUserApi as jest.Mock<() => Promise<any>>).mockResolvedValue({});

        store.dispatch(getUserData());
        expect(store.getState().loginUserRequest).toBe(true);
      });
      test('Проверка успешного выполнения запроса', async () => {
        (getUserApi as jest.Mock<() => Promise<any>>).mockResolvedValue({
          user: mockedUser
        });

        await store.dispatch(getUserData());
        expect(store.getState().loginUserRequest).toBe(false);
        expect(store.getState().isAuthChecked).toBe(true);
        expect(store.getState().isAuthenticated).toBe(true);
        expect(store.getState().user).toEqual(mockedUser);
      });
      test('Проверка ошибки при обработке запроса', async () => {
        (getUserApi as jest.Mock<() => Promise<any>>).mockRejectedValue(
          'ошибка'
        );

        await store.dispatch(getUserData());
        expect(store.getState().loginUserRequest).toBe(false);
        expect(store.getState().isAuthChecked).toBe(true);
        expect(store.getState().isAuthenticated).toBe(false);
        expect(store.getState().loginUserError).toBe('ошибка');
      });
    });
    describe('Логаут юзера', () => {
      test('Проверка обработки запроса', async () => {
        (logoutApi as jest.Mock<() => Promise<any>>).mockResolvedValue({});
        store.dispatch(logoutUser());
        expect(store.getState().logoutUserRequest).toBe(true);
      });
      test('Проверка успешного выполнения запроса', async () => {
        (logoutApi as jest.Mock<() => Promise<any>>).mockResolvedValue({});
        await store.dispatch(logoutUser());
        expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
        expect(deleteCookie).toHaveBeenCalledWith('accessToken');
        expect(store.getState().logoutUserRequest).toBe(false);
        expect(store.getState().isAuthenticated).toBe(false);
        expect(store.getState().user).toEqual(null);
      });
    });
  });
});
