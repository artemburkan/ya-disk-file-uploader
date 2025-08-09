import crypto from 'crypto'

export const generateScopedName = (
  name: string,
  // filename: string,
  css: string
) => {
  // const componentName = filename
  //   .replace(/\.\w+$/, '')
  //   .split('/')
  //   .pop()
  //   ?.replace('.module', '')
  //   ?.toLowerCase()

  // Generate hash
  // const hash = crypto
  //   .createHash('md5')
  //   .update(css)
  //   .digest('base64')
  //   .substring(0, 5)

  const hash = crypto.createHash('sha256').update(css).digest('hex').slice(0, 5)

  // return `${componentName}__${name}_${hash}`
  return `${name}_${hash}`
}
