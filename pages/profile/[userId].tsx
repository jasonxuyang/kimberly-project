import { fetcher } from "@/utils/client";
import useAuth from "@/utils/hooks/useAuth";
import { Course, User } from "@prisma/client";
import useSWR from "swr";
import NotFound from "../error/notFound";
import { useRouter } from "next/router";
import useRole from "@/utils/hooks/useRole";
import useAccounts from "@/utils/hooks/useAccounts";
import account from "../api/account";

export default function Profile() {
  const router = useRouter();
  const userId = router.query.userId;
  const { user, isSignedIn } = useAuth();
  const { currentRole } = useRole();
  const { currentAccount } = useAccounts();
  const { data: userData, isLoading: userIsLoading } = useSWR(
    `/api/user/${userId}`,
    fetcher
  );
  const { data: accountData, isLoading: accountIsLoading } = useSWR(
    `/api/account/${currentRole}/${currentAccount?.id}`,
    fetcher
  );
  if (userIsLoading || accountIsLoading) return <main>Loading...</main>;
  if (!userData.success || !accountData.success) return <NotFound />;

  const userInfo: User = userData.data;
  const courses: Course[] = accountData.data;
  const hasPermissions = isSignedIn && user?.id === userInfo.id;

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
      <div>First name: {userInfo?.firstName}</div>
      <div>Last name: {userInfo?.lastName}</div>
      <div>Email: {userInfo?.email}</div>
      {hasPermissions && <div>Password: {userInfo.password}</div>}
      <div>Courses: {renderCourses()}</div>
    </main>
  );
}
