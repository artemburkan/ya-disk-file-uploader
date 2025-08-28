import crypto from 'crypto'

export const generateScopedName =
  (mode: string) => (name: string, filename: string) => {
    const hash = crypto
      .createHash('sha1')
      .update(filename + name)
      .digest('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 6)

    if (mode === 'development') {
      return `${name}_${hash}`
    }

    return `_${hash}`
  }
