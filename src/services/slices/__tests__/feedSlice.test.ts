import feedReducer, { getFeeds, getProfileOrders } from '../feedSlice';
import { TOrder } from '@utils-types';

const order: TOrder = {
  _id: 'order-id',
  status: 'done',
  name: 'testOrder',
  number: 12345,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ingredients: ['bun-id', 'main-id']
};

const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  profileOrders: [],
  isLoading: false,
  error: null
};

describe('feed reducer', () => {
  describe('getFeeds (лента заказов)', () => {
    test('Обрабатывает getFeeds.pending', () => {
      const state = feedReducer(initialState, getFeeds.pending(''));

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обрабатывает getFeeds.fulfilled', () => {
      const state = feedReducer(
        { ...initialState, isLoading: true },
        getFeeds.fulfilled(
          { success: true, orders: [order], total: 100, totalToday: 10 },
          ''
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.orders).toEqual([order]);
    });

    test('Обрабатывает getFeeds.rejected', () => {
      const state = feedReducer(
        { ...initialState, isLoading: true },
        getFeeds.rejected(new Error('Ошибка загрузки ленты.'), '')
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ленты.');
    });
  });

  describe('getProfileOrders (история заказов)', () => {
    test('Обрабатывает getProfileOrders.pending', () => {
      const state = feedReducer(initialState, getProfileOrders.pending(''));

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обрабатывает getProfileOrders.fulfilled', () => {
      const state = feedReducer(
        { ...initialState, isLoading: true },
        getProfileOrders.fulfilled([order], '')
      );

      expect(state.isLoading).toBe(false);
      expect(state.profileOrders).toEqual([order]);
    });

    test('Обрабатывает getProfileOrders.rejected', () => {
      const state = feedReducer(
        { ...initialState, isLoading: true },
        getProfileOrders.rejected(new Error('Ошибка загрузки истории.'), '')
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки истории.');
    });
  });

  test('Возвращает начальное состояние при неизвестном экшене.', () => {
    expect(feedReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });
});
