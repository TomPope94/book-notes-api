export function calculateCost(slots) {
  const costPennies = (slots / 2) * (2 * 0.99 + (slots - 1) * -0.1);

  return costPennies * 100;
}
