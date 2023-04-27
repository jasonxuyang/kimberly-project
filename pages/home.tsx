import Loading from "@/components/loading";
import { PostComponent, PostInputComponent } from "@/components/post";
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
  if (isLoading) return <Loading />;

  const posts: Array<Post & { children?: Post[] }> = data.data;

  const renderPosts = () => {
    if (!posts || !posts.length) return null;
    return posts.map((post) => {
      return <PostComponent key={post.id} postData={post} />;
    });
  };

  return (
    <main className="flex flex-col w-full items-center mt-16 mb-16">
      <div className="flex flex-col w-[90%] sm:w-[65%] gap-4">
        {isSignedIn && <PostInputComponent />}
        {renderPosts()}
      </div>
    </main>
  );
}
