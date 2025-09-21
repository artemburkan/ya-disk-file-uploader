export const debounce = <T extends (...params: Parameters<T>) => ReturnType<T>>(
  delay: number,
  func: T,
): ((...params: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...params: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => func(...params), delay)
  }
}
