// import { SignUpProps } from "@/utils/client";
// import { ApiError, ApiResponse } from "@/utils/types";
// import { PrismaClient, Role } from "@prisma/client";
// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ApiResponse>
// ) {
//   try {
//     const { userId } = req.body;
//     const client = new PrismaClient();
//     const studentAccount = await client.student.findUnique({
//       where: {
//         userId: String(userId),
//       },
//     });
//     const professorAccount = await client.professor.findUnique({
//       where: {
//         userId: String(userId),
//       },
//     });
//     const assistantAccount = await client.assistant.findUnique({
//       where: {
//         userId: String(userId),
//       },
//     });

//     return res.status(201).json({ success: true, data: user });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       data: { type: ApiError.Unknown, data: error },
//     });
//   }
// }
