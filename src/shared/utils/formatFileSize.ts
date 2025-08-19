export const formatFileSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0

  while (bytes >= 1024 && i < units.length - 1) {
    bytes = bytes / 1024
    i++
  }

  return `${bytes.toFixed(2)} ${units[i]}`
}
