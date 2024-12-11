import { getRandomArbitrary } from "./randomNumber.js";

export const shuffle = (list = []) => {
  const shuffled = list.slice();

  for (let i = shuffled.length - 1; i > 1; i--) {
    const j = getRandomArbitrary(0, i);
    const aux = shuffled[j];

    shuffled[j] = shuffled[i];
    shuffled[i] = aux;
  }

  return shuffled;
};
