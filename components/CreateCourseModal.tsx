import useAccounts from "@/utils/hooks/useAccounts";
import useAuth from "@/utils/hooks/useAuth";
import useRole from "@/utils/hooks/useRole";
import { Role } from "@prisma/client";
import { BaseSyntheticEvent, useState } from "react";
import { CreateCourseProps, createCourse } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import { mutate } from "swr";

export default function CreateCourse() {
  const { isSignedIn } = useAuth();
  const { currentRole } = useRole();
  const { currentAccount } = useAccounts();
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState<ApiError | null>(null);

  const isProfessor = currentRole === Role.PROFESSOR;

  if (!isSignedIn || !currentAccount) return null;
  if (!isProfessor) return null;

  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const courseData: CreateCourseProps = {
      courseName: courseName,
      accountId: currentAccount.id,
    };
    const response: ApiResponse = await createCourse(courseData);
    if (response.success) {
      console.log("Course created successfully");
      mutate(`/api/course`);
    } else {
      setError(response.data.type);
      console.error(error);
    }
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <form onSubmit={onSubmit}>
        <label htmlFor="courseName">
          Course Name:{" "}
          <input
            type="text"
            name="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="text-black"
            required
          />
        </label>
        <button type="submit" class="bg-blue-500 font-semibold text-white py-2 rounded-md hover:bg-blue-600" style="padding: 10px">Create Course</button>
      </form>
    </div>
  );
}
