import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

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

const main: TIngredient = {
  _id: 'main-id',
  name: 'testMain',
  type: 'main',
  fat: 21,
  proteins: 11,
  price: 200,
  calories: 41,
  carbohydrates: 31,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const sauce: TIngredient = {
  _id: 'sauce-id',
  name: 'testSauce',
  type: 'sauce',
  fat: 22,
  price: 300,
  proteins: 12,
  calories: 42,
  carbohydrates: 32,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

const mainConstructor: TConstructorIngredient = {
  ...main,
  id: 'main-constructor-id'
};

const sauceConstructor: TConstructorIngredient = {
  ...sauce,
  id: 'sauce-constructor-id'
};

const initialState = {
  bun: null,
  ingredients: []
};

describe('burgerConstructor reducer', () => {
  test('Добавление булки в constructor.bun', () => {
    const state = constructorReducer(initialState, addIngredient(bun));

    expect(state.bun).toEqual({ ...bun, id: expect.any(String) });
  });

  test('Добавление начинки в массив ingredients.', () => {
    const state = constructorReducer(initialState, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([{ ...main, id: expect.any(String) }]);
  });

  test('Удаление ингредиента из конструктора.', () => {
    const state = constructorReducer(
      {
        bun,
        ingredients: [mainConstructor, sauceConstructor]
      },
      removeIngredient(mainConstructor.id)
    );

    expect(state.ingredients).toEqual([sauceConstructor]);
  });

  test('Изменение порядка ингредиентов в конструктор.', () => {
    const state = constructorReducer(
      {
        bun,
        ingredients: [mainConstructor, sauceConstructor]
      },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients).toEqual([sauceConstructor, mainConstructor]);
  });

  test('Очистка корзины.', () => {
    const state = constructorReducer(
      { bun, ingredients: [mainConstructor] },
      clearConstructor()
    );

    expect(state).toEqual(initialState);
  });

  test('Возвращает начальное состояние при неизвестном экшене.', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });
});
