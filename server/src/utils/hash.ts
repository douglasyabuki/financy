import bcrypt from 'bcryptjs'

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(plainPassword, salt)
}

export const comparePassword = async (
  plainPassword: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashPassword)
}
