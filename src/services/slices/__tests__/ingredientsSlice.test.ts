import ingredientsReducer, { getIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

const bun: TIngredient = {
  _id: 'bun-id',
  name: 'testBun',
  type: 'bun',
  proteins: 10,
  fat: 20,
  calories: 40,
  carbohydrates: 30,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null
};

describe('ingredients reducer', () => {
  test('Обрабатывает getIngredients.pending', () => {
    expect(
      ingredientsReducer(initialState, getIngredients.pending(''))
    ).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('Обрабатывает getIngredients.fulfilled', () => {
    expect(
      ingredientsReducer(
        { ingredients: [], isLoading: true, error: null },
        getIngredients.fulfilled([bun], '')
      )
    ).toEqual({
      ingredients: [bun],
      isLoading: false,
      error: null
    });
  });

  test('Обрабатывает getIngredients.rejected', () => {
    expect(
      ingredientsReducer(
        { ingredients: [], isLoading: false, error: null },
        getIngredients.rejected(new Error('Ошибка загрузки.'), '')
      )
    ).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка загрузки.'
    });
  });

  test('Возвращает начальное состояние при неизвестном экшене.', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });
});
