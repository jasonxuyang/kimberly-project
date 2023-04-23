import useAccounts from "@/utils/hooks/useAccounts";
import useAuth from "@/utils/hooks/useAuth";
import useRole from "@/utils/hooks/useRole";
import { Role } from "@prisma/client";
import InvalidPermissions from "../error/invalidPermissions";
import SignInRequired from "../error/signInRequired";
import { BaseSyntheticEvent, useState } from "react";
import { CreateCourseProps, createCourse } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";

export default function CreateCourse() {
  const { isSignedIn } = useAuth();
  const { currentRole } = useRole();
  const { currentAccount } = useAccounts();
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState<ApiError | null>(null);

  const isProfessor = currentRole === Role.PROFESSOR;

  if (!isSignedIn || !currentAccount) return <SignInRequired />;
  if (!isProfessor) return <InvalidPermissions />;

  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const courseData: CreateCourseProps = {
      courseName: courseName,
      accountId: currentAccount?.id,
    };
    const response: ApiResponse = await createCourse(courseData);
    if (response.success) {
      console.log("Course created successfully");
    } else {
      setError(response.data.type);
      console.error(error);
    }
  };

  return (
    <main>
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
        <button type="submit">Create Course</button>
      </form>
    </main>
  );
}
