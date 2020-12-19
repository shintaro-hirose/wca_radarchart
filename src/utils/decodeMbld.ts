export const mbldSolved = (value: number): number => {
  const points = 99 - (Math.floor(value / 1e7) % 100)
  return points
}
