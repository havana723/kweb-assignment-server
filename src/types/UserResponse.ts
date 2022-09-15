import { User } from "@prisma/client";

export default interface UserResponse {
  username: string;
  name: string;
  uniqueId: string;
  role: "STUDENT" | "PROFESSOR";
}

export const toUserResponse = (user: User): UserResponse => {
  return {
    username: user.username,
    name: user.name,
    uniqueId: user.uniqueId,
    role: user.role,
  };
};
