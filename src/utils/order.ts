import type { TIngredient, TOrder, TOrderStatus } from './types';

export type TOrderIngredient = TIngredient & {
  count: number;
};

export const getOrderStatusText = (status: TOrderStatus): string => {
  const statuses: Record<TOrderStatus, string> = {
    created: 'Создан',
    pending: 'Готовится',
    done: 'Выполнен',
  };

  return statuses[status];
};

export const getOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TIngredient[] => {
  return order.ingredients.reduce<TIngredient[]>((acc, ingredientId) => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);

    if (ingredient) {
      acc.push(ingredient);
    }

    return acc;
  }, []);
};

export const getOrderPrice = (order: TOrder, ingredients: TIngredient[]): number => {
  return getOrderIngredients(order, ingredients).reduce(
    (total, ingredient) => total + ingredient.price,
    0
  );
};

export const getUniqueOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TOrderIngredient[] => {
  const orderIngredients = getOrderIngredients(order, ingredients);
  const ingredientCounts = orderIngredients.reduce<Record<string, number>>(
    (counts, ingredient) => ({
      ...counts,
      [ingredient._id]: (counts[ingredient._id] ?? 0) + 1,
    }),
    {}
  );

  return Object.keys(ingredientCounts).reduce<TOrderIngredient[]>(
    (acc, ingredientId) => {
      const ingredient = ingredients.find((item) => item._id === ingredientId);

      if (ingredient) {
        acc.push({
          ...ingredient,
          count: ingredientCounts[ingredientId],
        });
      }

      return acc;
    },
    []
  );
};

export const formatOrderDate = (date: string): string => {
  const orderDate = new Date(date);
  const now = new Date();

  const startOfOrderDate = new Date(
    orderDate.getFullYear(),
    orderDate.getMonth(),
    orderDate.getDate()
  );
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfOrderDate.getTime()) / 86_400_000
  );

  const dayText =
    diffDays === 0 ? 'Сегодня' : diffDays === 1 ? 'Вчера' : `${diffDays} дн. назад`;

  const timeText = orderDate.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return `${dayText}, ${timeText}`;
};
