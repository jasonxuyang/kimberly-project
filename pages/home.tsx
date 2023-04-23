import CreatePost from "@/components/createPost";
import { fetcher } from "@/utils/client";
import useAccounts from "@/utils/hooks/useAccounts";
import useAuth from "@/utils/hooks/useAuth";
import useRole from "@/utils/hooks/useRole";
import { Post, Role } from "@prisma/client";
import useSWR from "swr";

export default function Home() {
  const { isSignedIn } = useAuth();
  const { currentRole, setCurrentRole } = useRole();
  const { hasAccount } = useAccounts();
  const { data, isLoading } = useSWR(`/api/posts`, fetcher);
  if (isLoading) return <main>loading</main>;
  const posts: Post[] = data.data;

  const renderRoleChooser = () => {
    return (
      isSignedIn &&
      !currentRole && (
        <div className="flex gap-2">
          Login as a:
          {hasAccount(Role.PROFESSOR) && (
            <button onClick={() => setCurrentRole(Role.PROFESSOR)}>
              professor
            </button>
          )}
          {hasAccount(Role.TA) && (
            <button onClick={() => setCurrentRole(Role.TA)}>ta</button>
          )}
          {hasAccount(Role.STUDENT) && (
            <button onClick={() => setCurrentRole(Role.STUDENT)}>
              student
            </button>
          )}
        </div>
      )
    );
  };

  const renderPosts = () => {
    return posts.map((post) => {
      return (
        <div key={post.id} className="border-white border-2 m-2 p-2">
          <div className="text-xl">{post.title}</div>
          <div>{post.content}</div>
        </div>
      );
    });
  };

  return (
    <main>
      {renderRoleChooser()}
      {<CreatePost />}
      {renderPosts()}
    </main>
  );
}
