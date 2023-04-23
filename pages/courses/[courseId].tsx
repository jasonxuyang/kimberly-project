import { Assistant, Course, Role, Student } from "@prisma/client";
import { useRouter } from "next/router";
import { Professor } from "@prisma/client";
import useRole from "@/utils/hooks/useRole";
import useAccounts from "@/utils/hooks/useAccounts";
import useCourse from "@/utils/hooks/useCourse";

export default function Course() {
  const router = useRouter();
  const { currentRole } = useRole();
  const { currentAccount } = useAccounts();
  const courseId = router.query.courseId;
  const {
    course,
    isLoading,
    isError,
    isMemberOfCurrentCourse,
    joinCurrentCourse,
    leaveCurrentCourse,
    deleteCurrentCourse,
  } = useCourse(courseId as string);

  if (isLoading) return <main>Loading...</main>;
  if (isError) return <main>Something went wrong</main>;
  const { name, professors, assistants, students } = course;

  const joinCourseButton = () => {
    if (!currentRole || !courseId || !currentAccount?.id) return null;
    return <div onClick={joinCurrentCourse}>Join Course</div>;
  };

  const leaveCourseButton = () => {
    if (!currentRole || !courseId || !currentAccount?.id) return null;
    return <div onClick={leaveCurrentCourse}>Leave Course</div>;
  };

  const deleteCourseButton = () => {
    if (
      !currentRole ||
      !courseId ||
      !currentAccount?.id ||
      !isMemberOfCurrentCourse ||
      currentRole !== Role.PROFESSOR
    )
      return null;
    return <div onClick={deleteCurrentCourse}>Delete Course</div>;
  };
  const renderProfessors = () => {
    return professors.map((professor: Professor) => {
      return (
        <div
          key={professor.userId}
          onClick={() => {
            router.push(`/profile/${professor.userId}`);
          }}
        >
          {professor.userFirstName} {professor.userLastName}
        </div>
      );
    });
  };

  const renderAssistants = () => {
    return assistants.map((assistant: Assistant) => {
      return (
        <div
          key={assistant.userId}
          onClick={() => {
            router.push(`/profile/${assistant.userId}`);
          }}
        >
          {assistant.userFirstName} {assistant.userLastName}
        </div>
      );
    });
  };

  const renderStudents = () => {
    return students.map((student: Student) => {
      return (
        <div
          key={student.userId}
          onClick={() => {
            router.push(`/profile/${student.userId}`);
          }}
        >
          {student.userFirstName} {student.userLastName}
        </div>
      );
    });
  };

  return (
    <main>
      {!isMemberOfCurrentCourse ? joinCourseButton() : leaveCourseButton()}
      {deleteCourseButton()}
      <div className="mb-4">Course Name: {name}</div>
      <div className="mb-4">Professors: {renderProfessors()}</div>
      <div className="mb-4">Assistants: {renderAssistants()}</div>
      <div>Students: {renderStudents()}</div>
    </main>
  );
}
