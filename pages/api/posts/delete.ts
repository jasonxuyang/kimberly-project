import prisma from "@/prisma/prisma";
import { DeletePostProps } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { postId }: DeletePostProps = req.body;
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        parent: { disconnect: true },
        children: {
          set: [],
        },
      },
    });
    await prisma.post.deleteMany({
      where: {
        OR: [{ id: postId }, { parentId: null }],
      },
    });
    return res.status(201).json({ success: true, data: {} });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: { type: ApiError.Unknown, data: error },
    });
  }
}
