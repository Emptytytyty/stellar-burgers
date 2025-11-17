import { describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { getIngredientsAction, IngredientsSlice } from './IngredientsSlice';
import { error } from 'console';
import { json } from 'stream/consumers';

const mockedIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    __v: 0
  }
];

describe('Слайс ингредиентов', () => {
  jest.spyOn(global, 'fetch').mockImplementation(
    () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockedIngredients })
      }) as Promise<Response>
  );
  test('Проверка обработки запроса ингредиентов', async () => {
    const store = configureStore({
      reducer: IngredientsSlice.reducer,
      preloadedState: {
        ingredients: [],
        error: null,
        isError: false,
        isLoading: false
      }
    });
    store.dispatch(getIngredientsAction());
    expect(store.getState().isLoading).toBe(true);
  });
  test('Проверка успешного выполнения запроса ингредиентов', async () => {
    const store = configureStore({
      reducer: IngredientsSlice.reducer,
      preloadedState: {
        ingredients: [],
        error: null,
        isError: false,
        isLoading: false
      }
    });
    await store.dispatch(getIngredientsAction());
    expect(store.getState().isLoading).toBe(false);
    expect(store.getState().ingredients).toEqual(mockedIngredients);
  });
  test('Проверка ошибки при запросе ингредиентов', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          ok: false,
          json: () => Promise.reject('ошибка')
        }) as Promise<Response>
    );
    const store = configureStore({
      reducer: IngredientsSlice.reducer,
      preloadedState: {
        ingredients: [],
        error: null,
        isError: false,
        isLoading: false
      }
    });
    await store.dispatch(getIngredientsAction());
    expect(store.getState().isError).toBe(true);
    expect(store.getState().error).toBe('ошибка');
  });
});
