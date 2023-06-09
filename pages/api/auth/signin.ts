import prisma from "@/prisma/prisma";
import { SignInProps } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { email, password }: SignInProps = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user || user.email !== email || user.password !== password)
      throw new Error(`Invalid credentials`);
    return res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      data: { type: ApiError.InvalidCredentials, data: error },
    });
  }
}
