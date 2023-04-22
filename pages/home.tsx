import useAuth from "@/utils/hooks/useAuth";
import Link from "next/link";

export default function Home() {
  const { isSignedIn, user, signOut } = useAuth();
  return (
    <main>
      {isSignedIn && (
        <div>
          <div>
            {user?.firstName} {user?.lastName}
          </div>
          <div>{user?.email}</div>
          <button>
            <Link href="/profile">View Profile</Link>
          </button>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
      {!isSignedIn && (
        <button>
          <Link href="/signin">Sign in</Link>
        </button>
      )}
    </main>
  );
}
