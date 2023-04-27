import useAccounts from "@/utils/hooks/useAccounts";
import useAuth from "@/utils/hooks/useAuth";
import useRole from "@/utils/hooks/useRole";
import { Role } from "@prisma/client";
import Link from "next/link";

export default function Nav() {
  const { isSignedIn, user, signOut } = useAuth();
  const { currentRole } = useRole();
  const { hasMultipleAccounts, hasAccount } = useAccounts();

  const renderLinks = () => {
    return (
      <div className="flex flex-row gap-8 items-center">
        <Link className="font-semibold text-lg hover:text-gray-700" href={`/`}>
          Office Hours
        </Link>
        <Link className="hover:underline" href={`/courses`}>
          Courses
        </Link>
        {isSignedIn && (
          <Link className="hover:underline" href={`/profile`}>
            Profile
          </Link>
        )}
      </div>
    );
  };

  const renderSignInButton = () => {
    if (!isSignedIn)
      return (
        <Link href={"/signin"}>
          <button className="bg-blue-500 font-semibold text-white py-2 px-4 rounded-sm hover:bg-blue-600 text-sm h-fit">
            Sign in{" "}
          </button>
        </Link>
      );
  };

  const renderAccountInfo = () => {
    if (!isSignedIn) return null;
    return (
      <div className="flex flex-row items-center gap-3">
        <div className="font-semibold capitalize">{user?.firstName}</div>
        <div className="h-4 bg-black w-[1.5px]" />
        {roleDropdown()}
        <button
          className="bg-gray-300 font-semibold text-gray-500 py-2 px-4 rounded-sm hover:bg-gray-400 hover:text-gray-600 text-sm h-fit"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>
    );
  };

  const roleDropdown = () => {
    if (!hasMultipleAccounts)
      return (
        <div className="capitalize items-center">
          {currentRole?.toLocaleLowerCase()}{" "}
        </div>
      );
    return (
      <select
        name="role"
        className="focus:outline-0 cursor-pointer"
        value={currentRole?.toString()}
      >
        {hasAccount(Role.PROFESSOR) && (
          <option value={Role.PROFESSOR.toString()}>Professor</option>
        )}
        {hasAccount(Role.TA) && <option value={Role.TA.toString()}>TA</option>}
        {hasAccount(Role.STUDENT) && (
          <option value={Role.STUDENT.toString()}>Student</option>
        )}
      </select>
    );
  };

  return (
    <div className="flex flex-row gap-8 items-center justify-between w-full px-6 py-3">
      {/* {renderAccountInfo()} */}
      {renderLinks()}
      <div className="flex flex-row gap-8">
        {renderAccountInfo()}
        {hasMultipleAccounts && roleDropdown()}
        {renderSignInButton()}
      </div>
    </div>
  );
}
