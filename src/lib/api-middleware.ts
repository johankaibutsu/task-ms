import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserIdFromToken() {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return payload.userId;
  } catch (error) {
    return null;
  }
}
