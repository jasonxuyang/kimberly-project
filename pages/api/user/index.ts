import prisma from "@/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { username, role } = req.body;
    const result = await prisma.user.create({
      data: {
        username,
        role,
      },
    });
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
