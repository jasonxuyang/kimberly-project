import { SignUpProps } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import { PrismaClient, Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { firstName, lastName, email, role, password }: SignUpProps =
      req.body;

    const client = new PrismaClient();
    switch (role) {
      case Role.PROFESSOR: {
        const result = await client.user.create({
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
        return res.status(201).json({ success: true, data: result });
      }
      case Role.STUDENT: {
        const result = await client.user.create({
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
        return res.status(201).json({ success: true, data: result });
      }
      case Role.TA: {
        const result = await client.user.create({
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
        return res.status(201).json({ success: true, data: result });
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
