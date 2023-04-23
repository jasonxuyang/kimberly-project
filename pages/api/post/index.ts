import prisma from "@/prisma/prisma";
import { ApiError, ApiResponse } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { HTTP_METHODS } from "next/dist/server/web/http";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    switch (req.method) {
      case HTTP_METHODS[3]: {
        const { accountId, courseName } = req.body;
        const course = await prisma.course.create({
          data: {
            name: courseName,
            professors: {
              connect: { id: accountId },
            },
          },
        });
        return res.status(201).json({ success: true, data: course });
      }
      case HTTP_METHODS[4]: {
        const { accountId, courseName } = req.body;
        const course = await prisma.course.create({
          data: {
            name: courseName,
            professors: {
              connect: { id: accountId },
            },
          },
        });
        return res.status(201).json({ success: true, data: course });
      }
      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`
        );
    }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(500).json({
        success: false,
        data: { type: ApiError.CourseNameExists, data: error },
      });
    }
    return res.status(500).json({
      success: false,
      data: { type: ApiError.Unknown, data: error },
    });
  }
}
