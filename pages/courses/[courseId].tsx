import { Assistant, Course, Post, Role, Student } from "@prisma/client";
import { useRouter } from "next/router";
import { Professor } from "@prisma/client";
import useRole from "@/utils/hooks/useRole";
import useAccounts from "@/utils/hooks/useAccounts";
import useCourse from "@/utils/hooks/useCourse";
import CreatePost from "@/components/createPost";
import ReplyPost from "@/components/replyPost";
import { deletePost } from "@/utils/client";
import { mutate } from "swr";

export default function Course() {
  const router = useRouter();
  const { currentRole } = useRole();
  const { currentAccount } = useAccounts();
  const courseId = router.query.courseId;
  const {
    course,
    courseIsLoading,
    courseIsError,
    isMemberOfCurrentCourse,
    joinCurrentCourse,
    leaveCurrentCourse,
    deleteCurrentCourse,
    posts,
  } = useCourse(courseId as string);

  if (courseIsLoading) return <main>Loading...</main>;
  if (courseIsError) return <main>Something went wrong</main>;
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

  const renderPosts = () => {
    return posts.map((post: Post & { children?: Post[] }) => {
      return (
        <div key={post.id} className="border-black border-2 m-2 p-2">
          <div className="text-xl">{post.title}</div>
          <div className="text-sm mb-2">{post.userFirstName}</div>
          <div>{post.content}</div>
          <ReplyPost parentId={post.id} courseId={courseId as string} />
          <button
            onClick={async () => {
              await deletePost({ postId: post.id });
              mutate(`api/posts/${courseId}`);
            }}
          >
            Delete
          </button>
          <div>
            {post.children?.map((reply) => {
              return (
                <div key={reply.id}>
                  <div className="text-sm mb-2 inline mr-2">
                    {reply.userFirstName ?? "Anonymous"}
                  </div>
                  {reply.content}{" "}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <main>
      {!isMemberOfCurrentCourse ? joinCourseButton() : leaveCourseButton()}
      {deleteCourseButton()}
      {isMemberOfCurrentCourse && <CreatePost courseId={courseId as string} />}
      <div className="mb-4">Course Name: {name}</div>
      <div className="mb-4">Professors: {renderProfessors()}</div>
      <div className="mb-4">Assistants: {renderAssistants()}</div>
      {isMemberOfCurrentCourse && <div>Students: {renderStudents()}</div>}
      {isMemberOfCurrentCourse && renderPosts()}
    </main>
  );
}
