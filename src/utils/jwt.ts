import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import config from "../config";

export class CredentialError extends Error {}

export function UserToJWT(user: User): string | null {
  return jwt.sign(
    {
      username: user.username,
    },
    config.JWT_SECRET
  );
}

export async function JWTToUser(token: string): Promise<User> {
  const data = await new Promise((resolve, reject) => {
    jwt.verify(
      token,
      config.JWT_SECRET,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err, decoded: any) =>
        err ? reject(new CredentialError(err.message)) : resolve(decoded)
    );
  });

  const { username } = data as { username: unknown };
  if (typeof username !== "string") {
    throw new CredentialError("Invalid credentials.");
  }

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) throw new CredentialError("Invalid credentials.");
  return user;
}
