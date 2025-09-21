export const formatFileSize = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB", "TB"]
  let i = 0

  for (i; bytes >= 1024 && i < units.length - 1; i++) {
    bytes = bytes / 1024
  }

  return `${bytes.toFixed(2)} ${units[i]}`
}
