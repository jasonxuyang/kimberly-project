import { SignUpProps } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import { PrismaClient, Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { firstName, lastName, email, role, password }: SignUpProps =
      req.body;

    const client = new PrismaClient();
    switch (role) {
      case Role.PROFESSOR: {
        const user = await client.user.create({
          data: {
            firstName,
            lastName,
            email,
            password,
            professor: {
              create: {},
            },
          },
        });
        return res.status(201).json({ success: true, data: user });
      }
      case Role.STUDENT: {
        const user = await client.user.create({
          data: {
            firstName,
            lastName,
            email,
            password,
            student: {
              create: {},
            },
          },
        });
        return res.status(201).json({ success: true, data: user });
      }
      case Role.TA: {
        const user = await client.user.create({
          data: {
            firstName,
            lastName,
            email,
            password,
            assistant: {
              create: {},
            },
          },
        });
        return res.status(201).json({ success: true, data: user });
      }
      default:
        throw new Error(`Unable to create a user of type ${role}.`);
    }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(500).json({
        success: false,
        data: { type: ApiError.EmailExists, data: error },
      });
    }
    return res.status(500).json({
      success: false,
      data: { type: ApiError.Unknown, data: error },
    });
  }
}
