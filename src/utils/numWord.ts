export default function num_word(value: number, words: string[]) {
  value = Math.abs(value) % 100;
  const num = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num === 1) return words[0];
  return words[2];
}

// num_word(value, ['товар', 'товара', 'товаров']));
// num_word(value, ['штука', 'штуки', 'штук']));
// num_word(value, ['пара', 'пары', 'пар']));
// num_word(value, ['рубль', 'рубля', 'рублей']));