export const getDate = (time: number): string => {
  const unixTimestamp = time; // Пример числа из created_at

  const date = new Date(unixTimestamp * 1000); // Умножаем на 1000 для миллисекунд
  const formattedDate = date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return formattedDate; // "05.04.2024, 15:34" (MSK)
};
