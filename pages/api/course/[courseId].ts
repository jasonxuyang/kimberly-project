import prisma from "@/prisma/prisma";
import { ApiResponse } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { HTTP_METHODS } from "next/dist/server/web/http";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const courseId = req.query.courseId;

  try {
    switch (req.method) {
      case HTTP_METHODS[0]: {
        const course = await prisma.course.findUnique({
          where: { id: String(courseId) },
          include: {
            professors: true,
            assistants: true,
            students: true,
          },
        });
        return res.status(201).json({ success: true, data: course });
      }
      case HTTP_METHODS[3]: {
        const { name, professorIds, assistantIds, studentIds } = req.body;
        const user = await prisma.course.update({
          where: { id: String(courseId) },
          data: { name, professorIds, assistantIds, studentIds },
        });
        return res.status(201).json({ success: true, data: user });
      }
      case HTTP_METHODS[5]: {
        const user = await prisma.course.delete({
          where: { id: String(courseId) },
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
