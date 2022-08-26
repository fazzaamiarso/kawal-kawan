import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(7);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!hashedPassword) throw Error("Hash gone wrong");

  return hashedPassword;
};
