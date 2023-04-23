import useAccounts from "@/utils/hooks/useAccounts";
import useAuth from "@/utils/hooks/useAuth";
import useRole from "@/utils/hooks/useRole";
import Link from "next/link";

export default function Nav() {
  const { isSignedIn, user, signOut } = useAuth();
  const { currentRole } = useRole();

  const renderAccountInfo = () => {
    if (!isSignedIn) return null;
    return (
      <div>
        <div>
          Name: {user?.firstName} {user?.lastName}
        </div>
        <div>Email: {user?.email}</div>
        <div>Role: {currentRole}</div>
      </div>
    );
  };

  const renderLinks = () => {
    return (
      <div className="flex flex-row gap-2">
        <button className="border-solid border-white border-2 p-2">
          <Link href={`/`}>Home</Link>
        </button>
        <button className="border-solid border-white border-2 p-2">
          <Link href={`/courses`}>Courses</Link>
        </button>
        {isSignedIn && (
          <button className="border-solid border-white border-2 p-2">
            <Link href={`/profile/${user?.id}`}>Profile</Link>
          </button>
        )}
      </div>
    );
  };

  const renderButton = () => {
    if (isSignedIn)
      return (
        <button
          className="border-solid border-white border-2 p-2"
          onClick={signOut}
        >
          Sign out
        </button>
      );
    return (
      <button className="border-solid border-white border-2 p-2">
        <Link href={"/signin"}>Sign in</Link>
      </button>
    );
  };

  return (
    <div className="flex flex-row gap-8 items-center w-full px-8 py-4">
      {renderAccountInfo()}
      {renderLinks()}
      {renderButton()}
    </div>
  );
}
