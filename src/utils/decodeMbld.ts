export const mbldPoint = (value: number): number => {
  const seconds = Math.floor(value / 100) % 1e5
  const points = 99 - (Math.floor(value / 1e7) % 100)
  return points + 1 - seconds / (60 * 60)
}
