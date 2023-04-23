import prisma from "@/prisma/prisma";
import { CreatePostProps } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { HTTP_METHODS } from "next/dist/server/web/http";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    switch (req.method) {
      case HTTP_METHODS[0]: {
        const posts = await prisma.post.findMany({
          where: {
            parent: null,
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
      case HTTP_METHODS[4]: {
        const {
          title,
          content,
          parentId,
          courseId,
          userAndRole,
        }: CreatePostProps = req.body;
        console.log(req.body);

        const post = await prisma.post.create({
          data: {
            title: title,
            content: content,
            parent: parentId
              ? {
                  connect: { id: parentId },
                }
              : undefined,
            course: courseId
              ? {
                  connect: { id: courseId },
                }
              : undefined,
            user: userAndRole
              ? {
                  connect: { id: userAndRole?.id },
                }
              : undefined,
            userRole: userAndRole?.role,
          },
        });
        return res.status(201).json({ success: true, data: post });
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
