import prisma from "@/prisma/prisma";
import { ApiError, ApiResponse } from "@/utils/types";
import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const slug = req.query.slug;
    const [role, accountId] = slug as string[];
    switch (role) {
      case Role.PROFESSOR: {
        const courses = await prisma.course.findMany({
          where: {
            professorIds: { has: String(accountId) },
          },
        });
        return res.status(201).json({ success: true, data: courses });
      }
      case Role.TA: {
        const courses = await prisma.course.findMany({
          where: {
            assistantIds: { has: String(accountId) },
          },
        });
        return res.status(201).json({ success: true, data: courses });
      }
      case Role.STUDENT: {
        const courses = await prisma.course.findMany({
          where: {
            studentIds: { has: String(accountId) },
          },
        });
        return res.status(201).json({ success: true, data: courses });
      }
      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`
        );
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: { type: ApiError.Unknown, data: error },
    });
  }
}
