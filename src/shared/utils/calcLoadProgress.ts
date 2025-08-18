export const calcLoadProgress = (loaded: number, total: number) => {
  return Math.floor((loaded / total) * 100)
}
