import useSWR, { mutate } from "swr";
import { fetcher, joinCourse, leaveCourse } from "../client";
import useAccounts from "./useAccounts";
import useRole from "./useRole";
import { Course, Role } from "@prisma/client";

export default function useCourse(courseId: string) {
  const { currentRole } = useRole();
  const { currentAccount } = useAccounts();
  const { data, isLoading } = useSWR(`/api/course/${courseId}`, fetcher);

  const isMemberOfCourse = () => {
    if (isLoading || !data.success) return false;
    const course: Course = data.data;
    switch (currentRole) {
      case Role.PROFESSOR: {
        return course.professorIds.some((id) => id === currentAccount?.id);
      }
      case Role.TA: {
        return course.assistantIds.some((id) => id === currentAccount?.id);
      }
      case Role.STUDENT: {
        return course.studentIds.some((id) => id === currentAccount?.id);
      }
      default:
        return false;
    }
  };

  const joinCurrentCourse = async () => {
    if (!currentRole || !courseId || !currentAccount?.id) return;
    await joinCourse({
      courseId: String(courseId),
      role: currentRole,
      accountId: currentAccount?.id,
    });
    mutate(`/api/course/${courseId}`);
  };

  const leaveCurrentCourse = async () => {
    if (!currentRole || !courseId || !currentAccount?.id) return;
    await leaveCourse({
      courseId: String(courseId),
      role: currentRole,
      accountId: currentAccount.id,
    });
    mutate(`/api/course/${courseId}`);
  };

  return {
    course: !isLoading && data.success && data.data,
    isLoading,
    isError: !isLoading && !data.success,
    isMemberOfCurrentCourse: isMemberOfCourse(),
    joinCurrentCourse,
    leaveCurrentCourse,
  };
}
