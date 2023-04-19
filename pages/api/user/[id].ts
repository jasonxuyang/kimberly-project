import prisma from "@/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.id;

  try {
    switch (req.method) {
      case "DELETE": {
        const user = await prisma.user.delete({
          where: { id: String(userId) },
        });
        return res.status(201).json(user);
      }
      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`
        );
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
