import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, bcrypt.genSaltSync(13));
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

interface IEncodeOptions {
  expiresIn?: string;
}

export const encodeJWT = (
  data: any,
  secret: string,
  options: IEncodeOptions = { expiresIn: "1h" }
) => {
  return jwt.sign(data, `${process.env.JWT_SECRET}-${secret}`, {
    ...options,
  });
};

export const decodeJWT = (token: string, secret: string) => {
  const payload = jwt.verify(token, `${process.env.JWT_SECRET}-${secret}`);
  return payload;
};
