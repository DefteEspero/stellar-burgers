import orderReducer, {
  clearOrder,
  clearOrderByNumber,
  createOrder,
  getOrderByNumber
} from '../orderSlice';
import { TOrder } from '@utils-types';

const newOrder = {
  _id: 'order-id',
  status: 'done',
  name: 'testBurger',
  owner: {
    name: 'testName',
    email: 'test@example.com',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  price: 2400,
  number: 71234
};

const order: TOrder = {
  _id: 'order-id',
  name: 'testOrder',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  status: 'done',
  number: 71234,
  ingredients: ['bun-id', 'main-id']
};

const initialState = {
  order: null,
  orderByNumber: null,
  error: null,
  isLoading: false
};

describe('order reducer', () => {
  test('clearOrder обнуляет созданный заказ.', () => {
    const state = orderReducer(
      { ...initialState, order: newOrder },
      clearOrder()
    );

    expect(state.order).toBeNull();
  });

  test('clearOrderByNumber обнуляет заказ, найденный по номеру.', () => {
    const state = orderReducer(
      { ...initialState, orderByNumber: order },
      clearOrderByNumber()
    );

    expect(state.orderByNumber).toBeNull();
  });

  describe('createOrder (оформление заказа)', () => {
    test('Обрабатывает createOrder.pending', () => {
      const state = orderReducer(initialState, createOrder.pending('', []));

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обрабатывает createOrder.fulfilled', () => {
      const state = orderReducer(
        { ...initialState, isLoading: true },
        createOrder.fulfilled(
          { success: true, name: newOrder.name, order: newOrder },
          '',
          []
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.order).toEqual(newOrder);
    });

    test('Обрабатывает createOrder.rejected', () => {
      const state = orderReducer(
        { ...initialState, isLoading: true },
        createOrder.rejected(new Error('Ошибка оформления заказа.'), '', [])
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка оформления заказа.');
    });
  });

  describe('getOrderByNumber (заказ по номеру)', () => {
    test('Обрабатывает getOrderByNumber.pending', () => {
      const state = orderReducer(
        initialState,
        getOrderByNumber.pending('', 71234)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обрабатывает getOrderByNumber.fulfilled', () => {
      const state = orderReducer(
        { ...initialState, isLoading: true },
        getOrderByNumber.fulfilled(
          { success: true, orders: [order] },
          '',
          71234
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.orderByNumber).toEqual(order);
    });

    test('Обрабатывает getOrderByNumber.rejected', () => {
      const state = orderReducer(
        { ...initialState, isLoading: true },
        getOrderByNumber.rejected(new Error('Заказ не найден.'), '', 71234)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Заказ не найден.');
    });
  });

  test('Возвращает начальное состояние при неизвестном экшене.', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });
});
