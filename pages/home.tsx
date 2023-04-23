import useAccounts from "@/utils/hooks/useAccounts";
import useAuth from "@/utils/hooks/useAuth";
import useRole from "@/utils/hooks/useRole";
import { Role } from "@prisma/client";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useAuth();
  const { currentRole, setCurrentRole } = useRole();
  const { hasAccount } = useAccounts();

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
      {renderRoleChooser()}
      {renderSignIn()}
    </main>
  );
}
