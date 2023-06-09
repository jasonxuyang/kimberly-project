import prisma from "@/prisma/prisma";
import { ApiError, ApiResponse } from "@/utils/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const userId = req.body;
    const studentAccount = await prisma.student.findUnique({
      where: {
        userId: String(userId),
      },
    });
    const professorAccount = await prisma.professor.findUnique({
      where: {
        userId: String(userId),
      },
    });
    const assistantAccount = await prisma.assistant.findUnique({
      where: {
        userId: String(userId),
      },
    });
    const accounts = {
      student: studentAccount,
      professor: professorAccount,
      assistant: assistantAccount,
    };
    return res.status(201).json({ success: true, data: accounts });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: { type: ApiError.Unknown, data: error },
    });
  }
}
