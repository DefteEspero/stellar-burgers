import userReducer, {
  clearUserError,
  checkingUserAuth,
  loginUser,
  registerUser,
  updateUser,
  logoutUser
} from '../userSlice';
import { TUser } from '@utils-types';

const user: TUser = {
  email: 'test@example.com',
  name: 'testName'
};

const loginData = { email: 'test@example.com', password: '123456' };
const registerData = {
  email: 'test@example.com',
  name: 'testName',
  password: '123456'
};

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
  updateUserError: null
};

describe('user reducer', () => {
  test('clearUserError сбрасывает ошибку.', () => {
    const state = userReducer(
      { ...initialState, error: 'Неизвестная ошибка' },
      clearUserError()
    );

    expect(state.error).toBeNull();
  });

  describe('checkingUserAuth (проверка авторизации)', () => {
    test('Обрабатывает checkingUserAuth.pending', () => {
      const state = userReducer(initialState, checkingUserAuth.pending(''));

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обрабатывает checkingUserAuth.fulfilled', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        checkingUserAuth.fulfilled(user, '')
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
    });

    test('Обрабатывает checkingUserAuth.rejected', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        checkingUserAuth.rejected(new Error('Нет токена.'), '')
      );

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('loginUser (вход)', () => {
    test('Обрабатывает loginUser.pending', () => {
      const state = userReducer(initialState, loginUser.pending('', loginData));

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обрабатывает loginUser.fulfilled', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        loginUser.fulfilled(user, '', loginData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
    });

    test('Обрабатывает loginUser.rejected', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        loginUser.rejected(new Error('Ошибка входа.'), '', loginData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка входа.');
    });
  });

  describe('registerUser (регистрация)', () => {
    test('Обрабатывает registerUser.pending', () => {
      const state = userReducer(
        initialState,
        registerUser.pending('', registerData)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обрабатывает registerUser.fulfilled', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        registerUser.fulfilled(user, '', registerData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
    });

    test('Обрабатывает registerUser.rejected', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        registerUser.rejected(
          new Error('Ошибка регистрации.'),
          '',
          registerData
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации.');
    });
  });

  describe('updateUser (редактирование профиля)', () => {
    test('Обрабатывает updateUser.fulfilled', () => {
      const updated: TUser = {
        email: 'new@example.com',
        name: 'newTestName'
      };

      const state = userReducer(
        { ...initialState, user },
        updateUser.fulfilled(updated, '', { name: 'Новое Имя' })
      );

      expect(state.user).toEqual(updated);
    });

    test('Обрабатывает updateUser.rejected', () => {
      const state = userReducer(
        initialState,
        updateUser.rejected(new Error('Ошибка обновления данных.'), '', {})
      );

      expect(state.updateUserError).toBe('Ошибка обновления данных.');
    });
  });

  describe('logoutUser (выход)', () => {
    test('Обрабатывает logoutUser.fulfilled', () => {
      const state = userReducer(
        { ...initialState, user, isLoading: true },
        logoutUser.fulfilled(undefined, '')
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    test('Обрабатывает logoutUser.rejected', () => {
      const state = userReducer(
        { ...initialState, user },
        logoutUser.rejected(new Error('Ошибка выхода.'), '')
      );

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe('Ошибка выхода.');
    });
  });

  test('Возвращает начальное состояние при неизвестном экшене.', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });
});
