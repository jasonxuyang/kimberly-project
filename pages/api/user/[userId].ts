import useAuth from "@/utils/hooks/useAuth";
import { ApiResponse } from "@/utils/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { HTTP_METHODS } from "next/dist/server/web/http";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const userId = req.query.userId;
  const { firstName, lastName, email } = req.body;

  try {
    const client = new PrismaClient();
    switch (req.method) {
      case HTTP_METHODS[0]: {
        const user = await client.user.findUnique({
          where: { id: String(userId) },
        });

        return res.status(201).json({ success: true, data: user });
      }
      case HTTP_METHODS[3]: {
        const user = await client.user.update({
          where: { id: String(userId) },
          data: { firstName, lastName, email },
        });
        return res.status(201).json({ success: true, data: user });
      }
      case HTTP_METHODS[5]: {
        const user = await client.user.delete({
          where: { id: String(userId) },
        });
        return res.status(201).json({ success: true, data: user });
      }
      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`
        );
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error });
  }
}
