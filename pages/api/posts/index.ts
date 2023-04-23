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
        const posts = await prisma.post.findMany();
        return res.status(201).json({ success: true, data: posts });
      }
      case HTTP_METHODS[4]: {
        const { title, content }: CreatePostProps = req.body;
        const post = await prisma.post.create({
          data: {
            title: title,
            content: content,
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
