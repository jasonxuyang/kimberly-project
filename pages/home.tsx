import useAccounts from "@/utils/hooks/useAccounts";
import useAuth from "@/utils/hooks/useAuth";
import useRole from "@/utils/hooks/useRole";
import { Role } from "@prisma/client";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, user, signOut } = useAuth();
  const { currentRole, setCurrentRole } = useRole();
  const { hasAccount } = useAccounts();

  const renderStatusBar = () => {
    return (
      isSignedIn && (
        <div>
          <div>
            {user?.firstName} {user?.lastName}
          </div>
          <div>{user?.email}</div>
          <button>
            <Link href={`/profile/${user?.id}`}>View Profile</Link>
          </button>
          <button onClick={signOut}>Sign out</button>
        </div>
      )
    );
  };

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
          {hasAccount(Role.TA) && <button>ta</button>}
          {hasAccount(Role.STUDENT) && <button>student</button>}
        </div>
      )
    );
  };

  const renderSignIn = () => {
    return (
      !isSignedIn && (
        <button>
          <Link href="/signin">Sign in</Link>
        </button>
      )
    );
  };

  return (
    <main>
      {renderStatusBar()}
      {renderRoleChooser()}
      {renderSignIn()}
    </main>
  );
}
