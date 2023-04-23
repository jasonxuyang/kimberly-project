import prisma from "@/prisma/prisma";
import { JoinAndLeaveCourseProps } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { accountId, courseId, role }: JoinAndLeaveCourseProps = req.body;
    switch (role) {
      case Role.PROFESSOR: {
        const professor = await prisma.professor.update({
          where: { id: accountId },
          data: {
            courses: {
              disconnect: {
                id: courseId,
              },
            },
          },
        });
        return res.status(201).json({ success: true, data: professor });
      }
      case Role.TA: {
        const TA = await prisma.assistant.update({
          where: { id: accountId },
          data: {
            courses: {
              disconnect: {
                id: courseId,
              },
            },
          },
        });
        return res.status(201).json({ success: true, data: TA });
      }
      case Role.STUDENT: {
        const student = await prisma.student.update({
          where: { id: accountId },
          data: {
            courses: {
              disconnect: {
                id: courseId,
              },
            },
          },
        });
        return res.status(201).json({ success: true, data: student });
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: { type: ApiError.Unknown, data: error },
    });
  }
}
