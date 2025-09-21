import crypto from "crypto"

export const generateUniqueName = (hasName: boolean) => (name: string, filename: string) => {
  const hash = crypto
    .createHash("sha1")
    .update(filename + name)
    .digest("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)

  return hasName ? `${name}_${hash}` : `_${hash}`
}
