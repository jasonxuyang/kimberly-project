import prisma from "@/prisma/prisma";
import { CreatePostProps, DeletePostProps } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
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
        const posts = await prisma.post.findMany({
          where: {
            parent: null,
            course: {
              id: String(courseId),
            },
          },
          orderBy: {
            datePosted: "desc",
          },
          include: {
            children: true,
          },
        });
        return res.status(201).json({ success: true, data: posts });
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
