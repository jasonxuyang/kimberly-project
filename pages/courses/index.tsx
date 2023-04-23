import { Course } from "@prisma/client";
import useSWR from "swr";
import { fetcher } from "@/utils/client";
import { useRouter } from "next/router";
import CreateCourse from "@/components/CreateCourseModal";

export default function Courses() {
  const router = useRouter();
  const { data, isLoading } = useSWR(`/api/course`, fetcher);

  if (isLoading) return <main>Loading...</main>;
  if (!data.success) return <main>Something went wrong</main>;

  const courses: Course[] = data.data;

  const renderCourses = () => {
    return courses.map((course) => {
      return (
        <div
          key={course.name}
          onClick={() => {
            router.push(`/courses/${course.id}`);
          }}
        >
          {course.name}
        </div>
      );
    });
  };
  return (
    <main>
      <CreateCourse />
      {renderCourses()}
    </main>
  );
}
